# FastAPI entrypoint

from fastapi import FastAPI, UploadFile, File
from PIL import Image
import io

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Fashion Recommendation API is running"}

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB")
    # TODO: call ML pipeline later
    return {"filename": file.filename, "size": img.size}
