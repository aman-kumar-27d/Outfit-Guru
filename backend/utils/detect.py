# YOLO detection + color extraction

"""
backend/utils/detect.py

Utility for:
- loading a YOLOv8 model (Ultralytics)
- detecting objects in an image (from bytes)
- extracting dominant colors per detection
- creating simple person-region crops (top/bottom/shoes) and their colors

Usage:
    from utils.detect import init_model, detect_image_bytes

    init_model()  # optional - model will lazy load on first detect
    results = detect_image_bytes(image_bytes)
"""

import io
import math
from typing import List, Dict, Any, Tuple, Optional

from PIL import Image
import numpy as np
import cv2
from ultralytics import YOLO
from sklearn.cluster import KMeans

# Global model handle (keeps model in memory between requests)
_MODEL = None


def init_model(model_path: str = "yolov8n.pt", device: Optional[str] = None):
    """
    Initialize / load the YOLO model and store in module global.
    You can call this at startup (FastAPI startup event) to pre-load weights.
    device: e.g. 'cpu' or 'cuda:0' (if available)
    """
    global _MODEL
    if _MODEL is None:
        if device:
            # YOLO will use device based on string, e.g. 'cuda' or 'cpu'
            _MODEL = YOLO(model_path).to(device)
        else:
            _MODEL = YOLO(model_path)
    return _MODEL


def _to_numpy(x):
    """Helper: convert torch tensor-like or list to numpy array safely."""
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
    """
    Extract dominant color from a BGR or RGB image (numpy array).
    Returns an (R,G,B) tuple of the dominant cluster.
    """
    if np_img is None or np_img.size == 0:
        return (0, 0, 0)
    # Ensure RGB
    if np_img.shape[2] == 3:
        img_rgb = cv2.cvtColor(np_img, cv2.COLOR_BGR2RGB)
    else:
        img_rgb = np_img

    h, w = img_rgb.shape[:2]
    max_dim = max(h, w)
    if max_dim > resize:
        scale = resize / max_dim
        new_w, new_h = int(w * scale), int(h * scale)
        img_small = cv2.resize(img_rgb, (new_w, new_h), interpolation=cv2.INTER_AREA)
    else:
        img_small = img_rgb

    pixels = img_small.reshape(-1, 3).astype(float)

    # Optional: filter out near-white/near-transparent pixels
    # Keep all pixels for simplicity

    # Choose k <= number of unique pixels for stability
    n_pixels = pixels.shape[0]
    k_use = min(int(k), max(1, min(n_pixels, 5)))

    try:
        kmeans = KMeans(n_clusters=k_use, random_state=0, n_init="auto")
        kmeans.fit(pixels)
        counts = np.bincount(kmeans.labels_)
        dominant = kmeans.cluster_centers_[counts.argmax()].astype(int)
        dominant_rgb = tuple(int(v) for v in dominant)
    except Exception:
        # Fallback: average color
        avg = pixels.mean(axis=0).astype(int)
        dominant_rgb = tuple(int(v) for v in avg)

    return dominant_rgb


def _split_person_regions(box: Tuple[int, int, int, int], img_shape: Tuple[int, int]) -> Dict[str, Tuple[int, int, int, int]]:
    """
    Given person bbox (x1,y1,x2,y2) and image shape (height,width),
    returns approximate region bboxes for top / bottom / shoes (as integers).
    The splits are heuristic:
      - top: upper 45% of person bbox
      - middle/bottom: next 35%
      - shoes: bottom ~20%
    Returns a dict of region_name -> (x1,y1,x2,y2)
    """
    x1, y1, x2, y2 = [int(v) for v in box]
    w = max(1, x2 - x1)
    h = max(1, y2 - y1)

    top_h = int(h * 0.45)
    middle_h = int(h * 0.35)
    bottom_h = h - top_h - middle_h  # remainder

    regions = {}
    # Ensure coords within image
    H, W = img_shape
    # top
    r_x1, r_y1 = x1, y1
    r_x2, r_y2 = x2, min(y1 + top_h, H)
    regions["top"] = (r_x1, r_y1, r_x2, r_y2)
    # middle / bottom (pants)
    r_x1, r_y1 = x1, min(y1 + top_h, H)
    r_x2, r_y2 = x2, min(y1 + top_h + middle_h, H)
    regions["bottom"] = (r_x1, r_y1, r_x2, r_y2)
    # shoes
    r_x1, r_y1 = x1, max(y2 - bottom_h, 0)
    r_x2, r_y2 = x2, y2
    regions["shoes"] = (r_x1, r_y1, r_x2, r_y2)

    return regions


def _crop_np(img_np: np.ndarray, bbox: Tuple[int, int, int, int]) -> np.ndarray:
    x1, y1, x2, y2 = bbox
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(img_np.shape[1], x2), min(img_np.shape[0], y2)
    if x2 <= x1 or y2 <= y1:
        return np.zeros((0, 0, 3), dtype=np.uint8)
    return img_np[y1:y2, x1:x2].copy()


def detect_image_bytes(image_bytes: bytes, conf_thresh: float = 0.25, k_colors: int = 2) -> Dict[str, Any]:
    """
    Main function to call from FastAPI.
    Input: raw image bytes (from UploadFile.read()).
    Output: dict with keys:
      - detections: list of detected objects by YOLO (label, bbox [x1,y1,x2,y2], confidence, dominant_color (RGB+hex))
      - person_regions: for each detected person, approximate regions (top,bottom,shoes) with dominant colors
      - width, height: original image size
    """
    model = init_model()  # lazy-load model if needed

    # Load image bytes via PIL
    pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_rgb = np.array(pil)  # RGB
    # Ultralytics can accept numpy images (RGB); keep copy for crops (we'll use cv2 conventions)
    # convert to BGR for color extraction convenience
    img_bgr = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2BGR)
    H, W = img_bgr.shape[:2]

    # Run YOLOv8 inference
    # results is a Results object; index 0 for first image
    results = model(img_rgb, conf=conf_thresh, verbose=False)  # returns a list-like
    res = results[0]

    out = {"width": int(W), "height": int(H), "detections": [], "person_regions": []}

    # Parse boxes/classes/confidences robustly
    if hasattr(res, "boxes") and len(res.boxes) > 0:
        try:
            boxes_xy = _to_numpy(res.boxes.xyxy)  # Nx4
            classes = _to_numpy(res.boxes.cls).astype(int)  # N
            confs = _to_numpy(res.boxes.conf).astype(float)  # N
        except Exception:
            # fallback: iterate through res.boxes
            boxes_xy = []
            classes = []
            confs = []
            for b in res.boxes:
                # each b has .xyxy, .cls, .conf
                coords = _to_numpy(b.xyxy[0])
                boxes_xy.append(coords)
                classes.append(int(_to_numpy(b.cls[0])))
                confs.append(float(_to_numpy(b.conf[0])))
            boxes_xy = np.array(boxes_xy)
            classes = np.array(classes)
            confs = np.array(confs)

        # iterate detections
        for i in range(boxes_xy.shape[0]):
            x1, y1, x2, y2 = [int(round(float(v))) for v in boxes_xy[i]]
            cls_id = int(classes[i])
            conf = float(confs[i])
            label = model.names.get(cls_id, str(cls_id))
            crop_bgr = _crop_np(img_bgr, (x1, y1, x2, y2))
            dom_rgb = get_dominant_color_np(crop_bgr, k=k_colors) if crop_bgr.size else (0, 0, 0)
            det = {
                "label": str(label),
                "bbox": [int(x1), int(y1), int(x2), int(y2)],
                "confidence": float(round(conf, 4)),
                "dominant_color_rgb": [int(dom_rgb[0]), int(dom_rgb[1]), int(dom_rgb[2])],
                "dominant_color_hex": _rgb_to_hex(dom_rgb)
            }
            out["detections"].append(det)

        # Person region heuristic: find indices for class == person (label name 'person')
        person_indices = [i for i, cid in enumerate(classes) if model.names.get(int(cid), "") == "person"]
        for pi in person_indices:
            bx = boxes_xy[pi].astype(int)
            reg_bboxes = _split_person_regions(bx, (H, W))
            person_obj = {
                "person_bbox": [int(bx[0]), int(bx[1]), int(bx[2]), int(bx[3])],
                "regions": {}
            }
            for rname, rbbox in reg_bboxes.items():
                crop = _crop_np(img_bgr, rbbox)
                if crop.size == 0:
                    dom = (0, 0, 0)
                else:
                    dom = get_dominant_color_np(crop, k=k_colors)
                person_obj["regions"][rname] = {
                    "bbox": [int(rbbox[0]), int(rbbox[1]), int(rbbox[2]), int(rbbox[3])],
                    "dominant_color_rgb": [int(dom[0]), int(dom[1]), int(dom[2])],
                    "dominant_color_hex": _rgb_to_hex(dom)
                }
            out["person_regions"].append(person_obj)
    else:
        # No detections returned
        out["detections"] = []
        out["person_regions"] = []

    return out


def visualize_predictions(image_bytes: bytes, save_path: str = "visualized.jpg", conf_thresh: float = 0.25):
    """
    Optional: run detection and save a visualization image with boxes + labels.
    Uses the model's .plot() helper when available.
    """
    model = init_model()
    pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img_rgb = np.array(pil)
    results = model(img_rgb, conf=conf_thresh, verbose=False)
    # The ultralytics Results object has .plot()
    vis = results[0].plot()  # returns BGR array
    # Convert to RGB and save
    if isinstance(vis, np.ndarray):
        vis_rgb = cv2.cvtColor(vis, cv2.COLOR_BGR2RGB)
        Image.fromarray(vis_rgb).save(save_path)
        return save_path
    else:
        # Fallback: just save original
        Image.fromarray(img_rgb).save(save_path)
        return save_path
