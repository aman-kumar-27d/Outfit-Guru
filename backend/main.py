
"""
main.py - FastAPI entrypoint for Fashion Recommendation API
Organized for clarity and maintainability.
"""


# Third-party imports
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Local application imports
from utils.detect import detect_image_bytes
from utils.face_blur import blur_faces



app = FastAPI(
    title="Fashion Recommendation API"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "Fashion Recommendation API - ready"}



@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    
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
    return result



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

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}