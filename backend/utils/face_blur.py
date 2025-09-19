"""
backend/utils/face_blur.py

Utility to detect faces and blur them in an image (bytes in → bytes out).
Uses MTCNN (robust) with OpenCV for Gaussian blur.
"""

import io
from typing import List, Tuple
import numpy as np
import cv2
from PIL import Image
from mtcnn.mtcnn import MTCNN


_detector = None


def init_face_detector():
    """Initialize global MTCNN detector once."""
    global _detector
    if _detector is None:
        _detector = MTCNN()
    return _detector


def blur_faces(image_bytes: bytes, blur_strength: int = 35) -> bytes:
    """
    Detect faces and blur them.
    Returns new image as bytes (JPEG).
    """
    detector = init_face_detector()

    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = np.array(pil_img)  # RGB
    img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    detections = detector.detect_faces(img)
    for d in detections:
        x, y, w, h = d["box"]
        x, y = max(0, x), max(0, y)
        face_roi = img_bgr[y:y+h, x:x+w]
        if face_roi.size == 0:
            continue
        # Apply Gaussian blur
        face_roi = cv2.GaussianBlur(face_roi, (blur_strength, blur_strength), 30)
        img_bgr[y:y+h, x:x+w] = face_roi

    # Convert back to bytes
    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    pil_out = Image.fromarray(img_rgb)
    out_bytes = io.BytesIO()
    pil_out.save(out_bytes, format="JPEG")
    return out_bytes.getvalue()
