# backend/utils/detect.py  (only the modified/added parts shown; keep existing imports)
import io, math
from PIL import Image
import numpy as np
import cv2
from ultralytics import YOLO
from typing import Dict, Any, Tuple
from sklearn.cluster import KMeans

# import classifier
from .classify import zero_shot_classify, init_classifier, image_embedding

# existing init_models(...) and other helper functions remain as before

# --- New: multi-dominant colors (primary + secondary)
def get_dominant_colors(np_img: np.ndarray, k: int = 2, resize: int = 150):
    """Return list of dominant colors (RGB tuples), primary first."""
    if np_img is None or np_img.size == 0:
        return []
    img_rgb = cv2.cvtColor(np_img, cv2.COLOR_BGR2RGB)
    h, w = img_rgb.shape[:2]
    if max(h, w) > resize:
        scale = resize / max(h, w)
        img_small = cv2.resize(img_rgb, (int(w*scale), int(h*scale)), interpolation=cv2.INTER_AREA)
    else:
        img_small = img_rgb
    pixels = img_small.reshape(-1, 3).astype(float)
    n_pixels = pixels.shape[0]
    k_use = min(k, max(1, min(n_pixels, 5)))
    try:
        kmeans = KMeans(n_clusters=k_use, random_state=0, n_init="auto")
        kmeans.fit(pixels)
        counts = np.bincount(kmeans.labels_)
        dominant_idxs = counts.argsort()[::-1]
        colors = [tuple(map(int, kmeans.cluster_centers_[i])) for i in dominant_idxs]
    except Exception:
        avg = pixels.mean(axis=0).astype(int)
        colors = [tuple(avg.tolist())]
    return colors

# --- New: partial-body heuristic utility
def person_height_ratio(person_bbox: Tuple[int,int,int,int], img_h: int) -> float:
    x1,y1,x2,y2 = person_bbox
    return (y2 - y1) / float(img_h)

# --- Modified detect_image_bytes to include refinement ---
def detect_image_bytes(image_bytes: bytes, conf_thresh: float = 0.25, k_colors: int = 2,
                       classifier_threshold: float = 0.35, combined_threshold: float = 0.35) -> Dict[str,Any]:
    """
    Now runs:
     - ensemble detection (existing)
     - filter stage (confidence + heuristics)
     - refine stage (zero-shot classifier on crops)
     - combine confidences: combined_conf = det_conf * 0.6 + cls_conf * 0.4 (example)
    """
    models = init_models()  # your ensemble
    pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_rgb = np.array(pil)
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    H, W = img_bgr.shape[:2]

    # run the models and gather detections (existing code)
    detections = []
    for name, model in models.items():
        results = model.predict(img_rgb, conf=conf_thresh, verbose=False)
        res = results[0]
        if not hasattr(res, "boxes") or len(res.boxes) == 0:
            continue
        boxes_xy = _to_numpy(res.boxes.xyxy)
        classes = _to_numpy(res.boxes.cls).astype(int)
        confs = _to_numpy(res.boxes.conf).astype(float)
        for i in range(boxes_xy.shape[0]):
            x1,y1,x2,y2 = [int(round(float(v))) for v in boxes_xy[i]]
            cls_id, conf = int(classes[i]), float(confs[i])
            label = model.names.get(cls_id, str(cls_id))
            detections.append({
                "source_model": name,
                "label": label,
                "bbox": [x1,y1,x2,y2],
                "confidence": round(conf,4)
            })

    # --- Filter stage: per-class confidence thresholds and person heuristics ---
    # Custom thresholds (tweakable)
    CLASS_CONF_THRESH = {
        "shoes": 0.45,
        "person": 0.3,
        "handbag": 0.3,
        "clothing": 0.25,
        "bag": 0.25,
        # default for others:
    }
    filtered = []
    # find person bbox(es)
    person_bboxes = [d for d in detections if d["label"].lower() == "person"]
    # pick largest person bbox if multiple
    person_bbox = None
    if person_bboxes:
        person_bbox = max(person_bboxes, key=lambda x: (x["bbox"][2]-x["bbox"][0])*(x["bbox"][3]-x["bbox"][1]))["bbox"]

    for d in detections:
        lab = d["label"].lower()
        det_conf = d["confidence"]
        thresh = CLASS_CONF_THRESH.get(lab, 0.25)
        # partial-body heuristic: if person exists and height ratio < 0.55 (only upper body visible), suppress shoes
        if lab in ("shoe","shoes","sneakers","loafers","sandals") and person_bbox is not None:
            h_ratio = person_height_ratio(person_bbox, H)
            if h_ratio < 0.55:
                # likely person crop doesn't include legs/shoes — raise threshold
                thresh = max(thresh, 0.6)
        if det_conf >= thresh:
            filtered.append(d)
    # filtered now contains surviving detections

    # --- Refine stage: run zero-shot classifier on clothing-like detections ---
    refined = []
    for d in filtered:
        lab = d["label"].lower()
        x1,y1,x2,y2 = d["bbox"]
        crop_np = img_bgr[y1:y2, x1:x2].copy() if (y2>y1 and x2>x1) else None
        if crop_np is None or crop_np.size==0:
            # no valid crop: copy original
            d["refined_label"] = lab
            d["refined_confidence"] = d["confidence"]
            refined.append(d)
            continue

        crop_pil = Image.fromarray(cv2.cvtColor(crop_np, cv2.COLOR_BGR2RGB))
        # only refine if label generic-ish
        refine_target = False
        generic_labels = {"clothing","clothes","apparel","accessories","bag","handbag"}
        if lab in generic_labels or lab in ("person",):
            refine_target = True

        if refine_target:
            # zero-shot classify (top 3)
            try:
                candidates = zero_shot_classify(crop_pil, top_k=3)
            except Exception as e:
                candidates = []
            if candidates:
                top_label, cls_score = candidates[0]
                # Combine confidences (example weighted average)
                combined_conf = 0.6 * d["confidence"] + 0.4 * cls_score
                # If combined is too low, skip refinement
                if combined_conf >= combined_threshold and cls_score >= classifier_threshold:
                    d["refined_label"] = top_label
                    d["refined_confidence"] = round(float(combined_conf),4)
                else:
                    # keep original label but attach best guess
                    d["refined_label"] = top_label
                    d["refined_confidence"] = round(float(combined_conf),4)
            else:
                d["refined_label"] = lab
                d["refined_confidence"] = d["confidence"]
        else:
            # non-generic label — keep as is
            d["refined_label"] = lab
            d["refined_confidence"] = d["confidence"]

        # add color info (primary + secondary)
        colors = get_dominant_colors(crop_np, k=2)
        d["colors"] = [{"rgb": list(c), "hex": "#{:02x}{:02x}{:02x}".format(*c)} for c in colors]
        refined.append(d)

    # --- Person regions (keep previous person region logic) ---
    person_regions = []
    if person_bbox is not None:
        reg_bboxes = _split_person_regions(person_bbox, (H, W))
        person_obj = {"person_bbox": person_bbox, "regions": {}}
        for rname, rbbox in reg_bboxes.items():
            crop = img_bgr[rbbox[1]:rbbox[3], rbbox[0]:rbbox[2]] if (rbbox[3]>rbbox[1] and rbbox[2]>rbbox[0]) else None
            dom = (0,0,0)
            if crop is not None and crop.size:
                dom = get_dominant_colors(crop, k=1)[0]
            person_obj["regions"][rname] = {
                "bbox": list(rbbox),
                "dominant_color_rgb": list(dom),
                "dominant_color_hex": "#{:02x}{:02x}{:02x}".format(*dom)
            }
        person_regions.append(person_obj)

    # Final JSON
    out = {
        "width": W,
        "height": H,
        "raw_detections": detections,
        "filtered_detections": filtered,
        "refined_detections": refined,
        "person_regions": person_regions
    }
    return out
