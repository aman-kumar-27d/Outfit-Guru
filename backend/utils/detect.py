"""
backend/utils/detect.py

YOLOv8 detection utility:
- Ensemble of models (YoloF.pt, yolov8s.pt, fallback yolov8n.pt)
- Detects clothing/objects in image
- Extracts dominant colors per detection
- Splits person detections into top/bottom/shoes with color analysis
"""

import os
import io
from typing import List, Dict, Any, Tuple, Optional

import numpy as np
import cv2
from PIL import Image
from sklearn.cluster import KMeans
from ultralytics import YOLO


# -------------------
# Model Initialization
# -------------------

_MODELS = {}


def init_models():
    """Initialize YOLO models (ensemble)."""
    global _MODELS
    if _MODELS:
        return _MODELS

    models = {}

    try:
        # Load clothing-specific model (renamed as YoloF.pt)
        if os.path.exists("./weights/YoloF.pt"):
            print("[INFO] Loading YoloF.pt (fashion-specific)")
            models["fashion"] = YOLO("./weights/YoloF.pt")
            print("[INFO] Loaded YoloF.pt (fashion-specific)")
    except Exception as e:
        print("[WARN] Could not load YoloF.pt:", e)

    try:
        # Load general YOLOv8 small model (better accuracy than n)
        if os.path.exists("./weights/yolov8s.pt"):
            models["general"] = YOLO("./weights/yolov8s.pt")
            print("[INFO] Loaded yolov8s.pt")
    except Exception as e:
        print("[WARN] Could not load yolov8s.pt:", e)

    if not models:
        print("[FALLBACK] Loading yolov8n.pt as backup")
        models["backup"] = YOLO("./weights/yolov8n.pt")

    _MODELS = models
    return models


# -------------------
# Helper Functions
# -------------------

def _to_numpy(x):
    try:
        import torch
        if hasattr(x, "cpu"):
            return x.cpu().numpy()
    except Exception:
        pass
    return np.array(x)


def _rgb_to_hex(rgb: Tuple[int, int, int]) -> str:
    return "#{:02x}{:02x}{:02x}".format(*rgb)


def get_dominant_color_np(np_img: np.ndarray, k: int = 2, resize: int = 150) -> Tuple[int, int, int]:
    if np_img is None or np_img.size == 0:
        return (0, 0, 0)

    img_rgb = cv2.cvtColor(np_img, cv2.COLOR_BGR2RGB)
    h, w = img_rgb.shape[:2]
    if max(h, w) > resize:
        scale = resize / max(h, w)
        img_rgb = cv2.resize(img_rgb, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

    pixels = img_rgb.reshape(-1, 3).astype(float)
    k_use = min(k, max(1, min(pixels.shape[0], 5)))

    try:
        kmeans = KMeans(n_clusters=k_use, random_state=0, n_init="auto")
        kmeans.fit(pixels)
        counts = np.bincount(kmeans.labels_)
        dominant = kmeans.cluster_centers_[counts.argmax()].astype(int)
        return tuple(int(v) for v in dominant)
    except Exception:
        avg = pixels.mean(axis=0).astype(int)
        return tuple(int(v) for v in avg)


def _split_person_regions(box: Tuple[int, int, int, int], img_shape: Tuple[int, int]):
    x1, y1, x2, y2 = [int(v) for v in box]
    h = max(1, y2 - y1)
    top_h, middle_h = int(h * 0.45), int(h * 0.35)
    bottom_h = h - top_h - middle_h

    H, W = img_shape
    return {
        "top": (x1, y1, x2, min(y1 + top_h, H)),
        "bottom": (x1, min(y1 + top_h, H), x2, min(y1 + top_h + middle_h, H)),
        "shoes": (x1, max(y2 - bottom_h, 0), x2, y2),
    }


def _crop_np(img_np: np.ndarray, bbox: Tuple[int, int, int, int]) -> np.ndarray:
    x1, y1, x2, y2 = bbox
    return img_np[max(0, y1):y2, max(0, x1):x2].copy()


# -------------------
# Detection Functions
# -------------------

def detect_image_bytes(image_bytes: bytes, conf_thresh: float = 0.3, k_colors: int = 2) -> Dict[str, Any]:
    models = init_models()

    pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_rgb = np.array(pil)
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    H, W = img_bgr.shape[:2]

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
            x1, y1, x2, y2 = [int(round(float(v))) for v in boxes_xy[i]]
            cls_id, conf = int(classes[i]), float(confs[i])
            label = model.names.get(cls_id, str(cls_id))

            crop_bgr = _crop_np(img_bgr, (x1, y1, x2, y2))
            dom_rgb = get_dominant_color_np(crop_bgr, k=k_colors) if crop_bgr.size else (0, 0, 0)

            detections.append({
                "source_model": name,
                "label": label,
                "bbox": [x1, y1, x2, y2],
                "confidence": round(conf, 4),
                "dominant_color_rgb": list(dom_rgb),
                "dominant_color_hex": _rgb_to_hex(dom_rgb),
            })

    out = {"width": W, "height": H, "detections": detections, "person_regions": []}

    # Person-specific color regions
    for det in detections:
        if det["label"].lower() == "person":
            reg_bboxes = _split_person_regions(det["bbox"], (H, W))
            person_obj = {"person_bbox": det["bbox"], "regions": {}}
            for rname, rbbox in reg_bboxes.items():
                crop = _crop_np(img_bgr, rbbox)
                dom = get_dominant_color_np(crop, k=k_colors) if crop.size else (0, 0, 0)
                person_obj["regions"][rname] = {
                    "bbox": list(rbbox),
                    "dominant_color_rgb": list(dom),
                    "dominant_color_hex": _rgb_to_hex(dom),
                }
            out["person_regions"].append(person_obj)

    return out


def visualize_predictions(image_bytes: bytes, save_path: str = "visualized.jpg", conf_thresh: float = 0.3):
    models = init_models()
    model = list(models.values())[0]  # use first available
    pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_rgb = np.array(pil)
    results = model(img_rgb, conf=conf_thresh, verbose=False)
    vis = results[0].plot()
    vis_rgb = cv2.cvtColor(vis, cv2.COLOR_BGR2RGB)
    Image.fromarray(vis_rgb).save(save_path)
    return save_path
