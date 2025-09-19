"""
backend/middleware/face_blur_middleware.py

FastAPI middleware to blur faces in uploaded images BEFORE
passing them to routes (like /analyze).
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from utils.face_blur import blur_faces


class FaceBlurMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Only intercept multipart/form-data requests with file uploads
        if request.method == "POST" and "multipart/form-data" in request.headers.get("content-type", ""):
            form = await request.form()
            new_form = {}
            for key, value in form.items():
                if hasattr(value, "file"):  # UploadFile
                    img_bytes = await value.read()
                    blurred_bytes = blur_faces(img_bytes)
                    # Replace with blurred bytes
                    value.file.seek(0)
                    value.file.write(blurred_bytes)
                    value.file.truncate()
                    value.file.seek(0)
                    new_form[key] = value
                else:
                    new_form[key] = value
            request._form = new_form
        response = await call_next(request)
        return response
