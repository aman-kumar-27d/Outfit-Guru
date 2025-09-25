# backend/utils/classify.py
import os
from typing import List, Tuple, Dict
from PIL import Image
import numpy as np

# Try to use FashionCLIP if installed (better for fashion), else fallback to transformers CLIP
try:
    from fashion_clip.fashion_clip import FashionCLIP
    _USE_FASHION_CLIP = True
except Exception:
    _USE_FASHION_CLIP = False

if not _USE_FASHION_CLIP:
    from transformers import CLIPProcessor, CLIPModel
    import torch

# --- Candidate fine-grained labels you want to support ---
FINE_LABELS = [
    "t-shirt", "shirt", "trousers", "jeans", "shorts", "skirt",
    "dress", "saree", "kurta", "jacket", "coat", "sweater",
    "bra", "underwear", "shorts_underwear", "shoes", "sandals",
    "loafers", "sneakers", "bag", "handbag", "accessory"
]

# --- Model init (singleton) ---
_CLIP_MODEL = None
_CLIP_PROCESSOR = None
_FC = None  # fashionclip wrapper if available
_DIM = None

def init_classifier(model_name: str = "fashion-clip"):
    global _CLIP_MODEL, _CLIP_PROCESSOR, _FC, _DIM, _USE_FASHION_CLIP
    if _USE_FASHION_CLIP:
        if _FC is None:
            _FC = FashionCLIP(model_name)  # loads default fashion-clip weights
            _DIM = _FC.embed_dim
    else:
        if _CLIP_MODEL is None:
            _CLIP_MODEL = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
            _CLIP_PROCESSOR = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
            _DIM = _CLIP_MODEL.visual_projection.out_features if hasattr(_CLIP_MODEL, 'visual_projection') else 512
    return

# --- Compute image embedding ---
def image_embedding(img: Image.Image) -> np.ndarray:
    init_classifier()
    if _USE_FASHION_CLIP and _FC is not None:
        emb = _FC.encode_images([img])  # returns np array (1, dim)
        return emb[0].astype("float32")
    else:
        # transformers CLIP fallback
        inputs = _CLIP_PROCESSOR(images=img, return_tensors="pt")
        with torch.no_grad():
            emb = _CLIP_MODEL.get_image_features(**inputs)
        emb = emb / emb.norm(p=2, dim=-1, keepdim=True)
        return emb.cpu().numpy()[0].astype("float32")

# --- Compute text embeddings for labels (cache them) ---
_TEXT_EMBED_CACHE = {}
def text_embedding(label: str) -> np.ndarray:
    init_classifier()
    if label in _TEXT_EMBED_CACHE:
        return _TEXT_EMBED_CACHE[label]
    prompt_variants = [
        f"a photo of a {label}",
        f"{label}",
        f"an image of {label}",
    ]
    if _USE_FASHION_CLIP and _FC is not None:
        emb = _FC.encode_texts(prompt_variants)  # returns array (n,dim)
        avg = emb.mean(axis=0)
        _TEXT_EMBED_CACHE[label] = avg / np.linalg.norm(avg)
        return _TEXT_EMBED_CACHE[label]
    else:
        # transformers CLIP
        inputs = _CLIP_PROCESSOR(text=prompt_variants, images=None, return_tensors="pt", padding=True)
        with torch.no_grad():
            text_feats = _CLIP_MODEL.get_text_features(**{k: v for k,v in inputs.items() if k in ["input_ids","attention_mask"]})
        text_feats = text_feats / text_feats.norm(p=2, dim=-1, keepdim=True)
        avg = text_feats.cpu().numpy().mean(axis=0)
        avg = avg / np.linalg.norm(avg)
        _TEXT_EMBED_CACHE[label] = avg.astype("float32")
        return _TEXT_EMBED_CACHE[label]

# --- Zero-shot classification: compares image embedding with text embeddings ---
def zero_shot_classify(img: Image.Image, candidate_labels: List[str]=None, top_k: int = 1) -> List[Tuple[str, float]]:
    """
    Returns list of (label, score) sorted desc. Score is cosine similarity in [ -1, 1].
    """
    if candidate_labels is None:
        candidate_labels = FINE_LABELS
    img_emb = image_embedding(img).astype("float32")
    img_emb = img_emb / np.linalg.norm(img_emb)
    sims = []
    for label in candidate_labels:
        txt_emb = text_embedding(label)
        # cos similarity
        score = float(np.dot(img_emb, txt_emb) / (np.linalg.norm(img_emb) * np.linalg.norm(txt_emb)))
        sims.append((label, score))
    sims.sort(key=lambda x: x[1], reverse=True)
    # normalize scores to 0..1 (simple transform)
    max_score = max(s[1] for s in sims)
    min_score = min(s[1] for s in sims)
    normed = []
    for label, sc in sims[:top_k]:
        if max_score == min_score:
            nsc = 1.0
        else:
            nsc = (sc - min_score) / (max_score - min_score)
        normed.append((label, float(nsc)))
    return normed

# --- Optional: placeholder for training a classifier (ResNet) later ---
def train_resnet_classifier(train_dir: str, val_dir: str, out_path: str = "resnet_fashion.pt", epochs:int=10):
    """
    train_dir/val_dir: folder structure with subfolders per class.
    This is a template — implement dataset and training loop using torchvision.
    """
    raise NotImplementedError("Implement training loop using torchvision.models.resnet18 / EfficientNet, dataset transforms, optimizer, etc.")
