
"""
main.py - FastAPI entrypoint for Fashion Recommendation API
Organized for clarity and maintainability.
"""


# Third-party imports
from fastapi import FastAPI, UploadFile, File , HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Local application imports
from utils.D2 import detect_image_bytes
# from utils.detect import detect_image_bytes
from utils.face_blur import blur_faces
from utils.llm_analyzer import analyze_outfit
from utils.recommend_hybrid import generate_hybrid_recommendations
from utils.llm_enhancer import enhance_recommendation

# Pydantic models for request/response validation
from pydantic import BaseModel
from typing import Optional, Any, Dict


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
    result = detect_image_bytes(blurred_bytes, conf_thresh=0.25)
    return result



# Request model for analysis
class AnalyzeRequest(BaseModel):
    detections: Dict[str, Any]
    person_regions: Optional[list] = None
    occasion: Optional[str] = "casual"


@app.post("/analyze/")
async def analyze_image(req: AnalyzeRequest):
    """
    Analyze the outfit using LLM.
    """
    # LLM analysis (no occasion yet)
    analysis = analyze_outfit(detections=req.detections, person_regions=req.person_regions, occasion=None)

    return {"analysis": analysis}


# Request model for recommendations
class RecommendRequest(BaseModel):
    detections: Dict[str, Any]
    person_regions: Optional[list] = None
    occasion: Optional[str] = "casual"
    exclude_previous: Optional[list] = None  # e.g. ["denim jacket"]

@app.post("/recommend/")
async def recommend(req: RecommendRequest):
    # use LLM analyzer suggestions if provided in the detection JSON (optional)
    # get llm_suggested_additions (if the client already called /analyze and has it)
    llm_suggestions = []
    analysis = {}
    # If client passed analysis inside detections, try to extract
    if "analysis" in req.detections:
        analysis = req.detections["analysis"]
        llm_suggestions = analysis.get("llm_suggested_additions", [])
    # else, you could re-run analyze_outfit here

    recs = generate_hybrid_recommendations(
        detections=req.detections.get("detections", []),
        person_regions=req.person_regions or req.detections.get("person_regions", []),
        occasion=req.occasion,
        llm_suggestions=llm_suggestions,
        exclude_previous=set([i.lower() for i in (req.exclude_previous or [])])
    )

    # Enhance with LLM to produce final_description
    enhanced = enhance_recommendation(req.detections, req.occasion, recs)

    return {"hybrid_recommendations": recs, "enhanced": enhanced}


# Health check
@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}