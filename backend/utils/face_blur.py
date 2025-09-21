"""
backend/utils/face_blur.py

Utility to detect faces and blur them in an image (bytes in → bytes out).
Uses MTCNN (robust) with OpenCV for Gaussian blur.
"""

# backend/utils/face_blur.py
import io
import os
import uuid
from typing import List, Tuple
import numpy as np
import cv2
from PIL import Image
from mtcnn.mtcnn import MTCNN

_detector = None

def init_face_detector():
    global _detector
    if _detector is None:
        _detector = MTCNN()
    return _detector


def blur_faces(image_bytes: bytes, blur_strength: int = 35, save_dir: str = "../blurred_uploads", debug: bool = True) -> bytes:
    """
    Detect and blur faces.
    Saves blurred copy to `save_dir/uuid_blurred.jpg`.
    If debug=True, also saves original as `uuid_original.jpg`.
    Returns new image bytes.
    """
    detector = init_face_detector()

    pil_img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = np.array(pil_img)
    img_bgr = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)

    detections = detector.detect_faces(img)
    for d in detections:
        x, y, w, h = d["box"]
        x, y = max(0, x), max(0, y)
        face_roi = img_bgr[y:y+h, x:x+w]
        if face_roi.size == 0:
            continue
        face_roi = cv2.GaussianBlur(face_roi, (blur_strength, blur_strength), 30)
        img_bgr[y:y+h, x:x+w] = face_roi

    img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
    pil_out = Image.fromarray(img_rgb)

    # ensure save dir
    os.makedirs(save_dir, exist_ok=True)
    filename = uuid.uuid4().hex

    if debug:
        # save original
        pil_img.save(os.path.join(save_dir, f"{filename}_original.jpg"), format="JPEG")

    # save blurred
    pil_out.save(os.path.join(save_dir, f"{filename}_blurred.jpg"), format="JPEG")

    # return as bytes
    out_bytes = io.BytesIO()
    pil_out.save(out_bytes, format="JPEG")
    return out_bytes.getvalue()
