# FastAPI entrypoint

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from utils.detect import init_model, detect_image_bytes
from middleware.face_blur_middleware import FaceBlurMiddleware


# Optionally initialize model at startup to avoid first-request lag
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # You can pass device="cuda" if you have GPU and want to use it
    init_model(model_path="yolov8n.pt", device=None)
    yield

app = FastAPI(title="Fashion Recommendation API", lifespan=lifespan)

# Add middleware for face blurring
app.add_middleware(FaceBlurMiddleware)


@app.get("/")
def root():
    return {"message": "Fashion Recommendation API - ready"}

@app.post("/analyze/")
async def analyze_image(file: UploadFile = File(...)):
    contents = await file.read()
    try:
        result = detect_image_bytes(contents, conf_thresh=0.25, k_colors=2)
        return JSONResponse(content=result)
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})