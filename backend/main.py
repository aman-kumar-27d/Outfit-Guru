
"""
main.py - FastAPI entrypoint for Fashion Recommendation API
Organized for clarity and maintainability.
"""

# Standard library imports
from contextlib import asynccontextmanager

# Third-party imports
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

# Local application imports
from utils.detect import init_model, detect_image_bytes
from utils.face_blur import blur_faces


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Initialize model at startup to avoid first-request lag.
    You can pass device="cuda" if you have GPU and want to use it.
    """
    init_model(model_path="yolov8n.pt", device=None)
    yield


app = FastAPI(
    title="Fashion Recommendation API",
    lifespan=lifespan
)


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "Fashion Recommendation API - ready"}


@app.post("/analyze/")
async def analyze_image(file: UploadFile = File(...)):
    """
    Accepts an image file, blurs faces, and runs detection.
    Only .jpg and .png images are allowed.
    """
    # Validate file extension
    allowed_ext = (".jpg", ".png")
    if not file.filename.lower().endswith(allowed_ext):
        return JSONResponse(status_code=400, content={"error": "Only .jpg and .png images are allowed."})

    # Read file contents
    contents = await file.read()
    if not contents:
        return JSONResponse(status_code=400, content={"error": "Empty file"})

    # Blur faces in the image
    blurred_bytes = blur_faces(contents)

    # Run detection on blurred image
    result = detect_image_bytes(blurred_bytes)
    return JSONResponse(content=result)
