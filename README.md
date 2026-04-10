### Fashion Recommendation

This project develops an intelligent web application that analyzes fashion images uploaded by users and provides instant style assessment and recommendations. The system uses computer vision and deep learning (ResNet50) to automatically classify clothing items, generate fashion compatibility scores on a 0-10 scale, and suggest similar or complementary fashion products. Users can simply upload a photo of an outfit and receive real-time feedback on style quality along with personalized recommendations for better alternatives. The application combines advanced AI techniques with an easy-to-use web interface, making professional fashion guidance accessible to everyday consumers and helping solve common styling challenges in online shopping.




## Tech stack (fast + free options)

Backend: FastAPI or Flask (Python).

Model libs: PyTorch, transformers (for CLIP), ultralytics / YOLOv8 or Detectron2 for detection if you need bounding boxes/segmentation.

Frontend: simple React or plain HTML/JS (drop-in file uploader and preview).

Prototyping infra: Google Colab (free GPU), local dev if you have GPU.

Storage: local file storage or free tier DB (SQLite for demo).


## Minimal viable architecture (how data flows)

User uploads selfie → front end POST to backend.

Backend runs a clothing detector/segmenter to get items + bounding boxes + dominant colors.

Backend runs a style classifier (simple classifier or rule engine) → outputs formal/casual etc.

Backend applies rule-based checks (shoe vs shirt mismatch, color clash heuristics).

Backend uses embedding retrieval (CLIP / FashionCLIP) to fetch 3 recommended outfit images and constructs textual suggestions.

Response returned to user: detected items, style label, 1–2 improvement tips, 3 recommended outfit examples.


### File structure

fashion-recommendation/
│
├── backend/                 # FastAPI backend
│   ├── main.py              # FastAPI entrypoint
│   ├── requirements.txt     # Python deps for backend
│   └── utils/               # helper functions
│
├── notebooks/               # Jupyter notebooks for experiments
│   └── week1_setup.ipynb
│
├── data/                    # small sample images / datasets
│
├── frontend/                # later if you add React or simple HTML
│
├── .gitignore
└── README.md


### 🔹 Implementation Roadmap

Detection layer (done) → YOLO + JSON.

LLM Outfit Analyzer → analyze_outfit.py (takes JSON, returns JSON).

Rule-based + ML recommender → recommend_hybrid.py.

LLM Recommendation Enhancer → enhance_recommendation.py.

Frontend integration → display both raw detections and LLM-enhanced descriptions.

### 👉 This pipeline makes your project:
✔️ Structured (rules + ML) → reliable.
✔️ Personalized (LLM) → human-like advice.
✔️ Interactive (feedback loop) → next-level user experience.


## 🚀 Installation

Clone repo and run:

```bash
# Linux/Mac
make install (Make.file)
    install:
	    pip install -r requirements.txt
	    python scripts/post_install.py
# Windows
install.bat
    @echo off
    pip install -r requirements.txt
    python scripts\post_install.py


python -m uvicorn main:app --reload