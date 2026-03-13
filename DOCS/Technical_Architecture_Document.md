# Technical Architecture Document
## Outfit Guru - AI-Powered Fashion Recommendation System

---

### Document Information
- **Project Name**: Outfit Guru
- **Version**: 1.0
- **Date**: November 19, 2025
- **Document Owner**: Development Team
- **Status**: Active

---

## 1. Introduction

### 1.1 Purpose
This document provides a comprehensive overview of the technical architecture for the Outfit Guru application. It details the system design, components, technologies, data flows, and infrastructure, serving as a guide for development, maintenance, and future scaling.

### 1.2 Scope
The scope of this document covers the frontend web application, the backend API, the machine learning models, and the interactions between these components. It includes both the current implementation and planned architectural improvements.

---

## 2. System Overview

### 2.1 Architectural Style
Outfit Guru is built using a **client-server architecture**.
- **Client (Frontend)**: A modern single-page application (SPA) built with React, responsible for user interaction, data presentation, and API communication.
- **Server (Backend)**: A Python-based RESTful API built with FastAPI, which handles business logic, image processing, and machine learning model inference.

This decoupled approach allows for independent development, scaling, and maintenance of the frontend and backend.

### 2.2 High-Level Architecture Diagram

```
+----------------------+      +------------------------+      +-----------------------+
|      User Device     |      |       Web Server       |      |   External Services   |
| (Browser)            |      | (FastAPI + Uvicorn)    |      | (Cloud APIs)          |
+----------------------+      +------------------------+      +-----------------------+
|                      |      |                        |      |                       |
|   +----------------+ |      |   +------------------+ |      |   +-----------------+ |
|   | React Frontend | |----->|   |   Backend API    | |----->|   | Perplexity LLM  | |
|   +----------------+ |      |   +------------------+ |      |   +-----------------+ |
|         ^            |      |           |            |      |                       |
|         |            |      |           |            |      |   +-----------------+ |
|         |            |      |           v            |      |   | Hugging Face    | |
|         |            |      |   +------------------+ |      |   | (Classifier)    | |
|         |            |      |   | ML Model Engine  | |      |   +-----------------+ |
|         |            |      |   +------------------+ |      |                       |
|         |            |      |                        |      |                       |
|         +------------|      +------------------------+      +-----------------------+
|                      |
+----------------------+
```

---

## 3. Frontend Architecture

### 3.1 Technology Stack
- **Framework**: **React 19** with **Vite** for fast development and optimized builds.
- **Language**: **TypeScript** for type safety and improved developer experience.
- **Styling**: **Tailwind CSS** for a utility-first styling approach, enabling rapid UI development.
- **UI Components**: A custom component library based on **shadcn/ui**, providing accessible and reusable components.
- **Routing**: **React Router v7** for client-side navigation.
- **State Management**: Primarily uses React's built-in hooks (`useState`, `useEffect`, `useRef`).
- **Linting**: **ESLint** with TypeScript support to enforce code quality.

### 3.2 Project Structure (`frontend/Outfit-Guru/src/`)
```
src/
├── assets/              # Static assets like images, fonts
├── components/          # Reusable UI components (e.g., Navbar, Button, Card)
│   ├── ui/              # Core shadcn/ui components
│   └── V2/              # Components specific to the V2 detection engine
├── devcomponents/       # Components for the developer-only /dev page
├── docs/                # Components and pages for the documentation site
├── lib/                 # Utility functions (e.g., cn for classnames)
├── App.tsx              # Main application component, handles routing
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind CSS imports
```

### 3.3 Key Components
- **`App.tsx`**: The root component that manages routing (`/`, `/dev`, `/docs`) and orchestrates the main layout, including the header, footer, and version switching logic.
- **`OutfitDetector.tsx` (v1)**: Handles the user flow for the v1 detection engine. Manages file uploads, API calls to `/detect`, and rendering of detection results.
- **`OutfitDetectorV2.tsx` (v2)**: A separate component for the v2 engine, interacting with the `/detect-v2` endpoint. This separation allows for easy A/B testing and independent development.
- **`OutfitAnalyzer.tsx`**: Displays the detailed analysis from the LLM, including positives, negatives, and recommendations. It is triggered after the initial detection is complete.
- **`VersionSwitcher.tsx`**: A UI element that allows users to toggle between the `v1` and `v2` detection engines, providing a way to compare results.
- **`DocsRouter.tsx`**: A dedicated router and layout for the documentation section, providing a seamless experience for developers and users exploring the API and features.

### 3.4 Data Flow
1. **Image Upload**: The user selects an image. A local preview is generated using `URL.createObjectURL()`.
2. **API Request**: The `File` object is appended to a `FormData` object and sent to the backend via a `POST` request using the `fetch` API.
3. **State Update**: The component enters a `loading` state. Upon receiving the JSON response from the backend, the `detections` and `personRegions` states are updated.
4. **Rendering**: The UI re-renders to display the detected bounding boxes and color information overlaid on the preview image.
5. **Analysis Request**: If the user requests analysis, the `detections` JSON is sent to the `/analyze` and `/recommend` endpoints. The response updates the `analysisData` state, which is passed to `OutfitAnalyzer.tsx`.

---

## 4. Backend Architecture

### 4.1 Technology Stack
- **Framework**: **FastAPI** for building a high-performance, asynchronous API with automatic OpenAPI/Swagger documentation.
- **Language**: **Python 3.x** with type hints for robust and clear code.
- **Web Server**: **Uvicorn** as the ASGI server.
- **Machine Learning**:
  - **Object Detection**: **Ultralytics YOLOv8** and a custom-trained **YOLO** model (`YoloF.pt`).
  - **Image Processing**: **OpenCV** and **Pillow (PIL)**.
  - **Face Detection**: **MTCNN**.
  - **Classification**: **Hugging Face Transformers** for zero-shot classification.
- **Dependencies**: Managed via `requirements.txt`.

### 4.2 Project Structure (`backend/`)
```
backend/
├── main.py              # FastAPI application entry point with all API endpoints
├── requirements.txt     # Python dependencies
├── utils/               # Core application logic and helper modules
│   ├── detect.py        # V1 detection logic
│   ├── D2.py            # V2 (refined) detection logic
│   ├── classify.py      # Zero-shot classification helper
│   ├── face_blur.py     # Face detection and blurring utility
│   ├── llm_analyzer.py  # Interface for Perplexity LLM
│   └── recommend_hybrid.py # Recommendation generation logic
└── weights/             # Pre-trained model weights (e.g., .pt files)
```

### 4.3 API Endpoints (`main.py`)
- **`POST /detect`**:
  - **Input**: An image file (`UploadFile`).
  - **Processing**: Blurs faces, then runs the v1 detection pipeline (`detect.py`).
  - **Output**: JSON containing detected items, bounding boxes, and dominant colors.
- **`POST /detect-v2`**:
  - **Input**: An image file (`UploadFile`).
  - **Processing**: Blurs faces, then runs the v2 refined detection pipeline (`D2.py`).
  - **Output**: JSON containing raw, filtered, and refined detections with enhanced color and classification data.
- **`POST /analyze`**:
  - **Input**: JSON object with `detections`.
  - **Processing**: Sends the detection data to the Perplexity LLM via `llm_analyzer.py` to get a qualitative analysis.
  - **Output**: JSON containing the LLM's analysis (description, positives, negatives, etc.).
- **`POST /recommend`**:
  - **Input**: JSON object with `detections` and user preferences (e.g., `occasion`).
  - **Processing**: Uses `recommend_hybrid.py` to generate recommendations by combining LLM suggestions and a rule-based engine.
  - **Output**: JSON containing a list of recommended items and an LLM-enhanced description.

### 4.4 Core Logic (`utils/`)
- **Detection (`detect.py` & `D2.py`)**:
  - An **ensemble of models** (`YoloF.pt`, `yolov8s.pt`) is used to maximize detection coverage.
  - **V1 (`detect.py`)** performs basic detection and color extraction.
  - **V2 (`D2.py`)** adds a refinement stage:
    1. **Filtering**: Applies stricter, class-specific confidence thresholds and heuristics (e.g., suppressing "shoes" if only the upper body is visible).
    2. **Refinement**: For generic detections ("clothing", "apparel"), it crops the item and runs a **zero-shot classifier** (`classify.py`) to get a more specific label (e.g., "denim jacket").
    3. **Confidence Combination**: The final confidence is a weighted average of the detection and classification scores.
- **Face Privacy (`face_blur.py`)**:
  - Uses the MTCNN model to find face bounding boxes.
  - Applies a strong Gaussian blur to each detected face region before any other processing.
- **LLM Integration (`llm_analyzer.py`, `llm_enhancer.py`)**:
  - Constructs carefully engineered prompts that include the detection data.
  - Sends requests to the Perplexity API.
  - Parses the JSON response from the LLM, with error handling for malformed output.
- **Hybrid Recommendation (`recommend_hybrid.py`)**:
  - A multi-source engine that prioritizes suggestions in the following order:
    1. **LLM Suggestions**: High-quality, context-aware ideas from the analysis step.
    2. **Rule-Based Suggestions**: Simple, reliable rules based on the selected `occasion`.
    3. **ML Retrieval (Future)**: A placeholder for a future FAISS-based similarity search.
  - De-duplicates suggestions to ensure a clean final list.

---

## 5. Data and Models

### 5.1 Data Flow Diagram (End-to-End)
```
1. User Uploads Image (JPG/PNG)
   |
   v
2. Frontend -> POST /detect-v2
   |
   v
3. Backend: main.py receives request
   |
   v
4. Backend: face_blur.py -> Blurs faces
   |
   v
5. Backend: D2.py -> Runs YOLO ensemble, filters, refines with classifier
   |
   v
6. Backend -> Returns Detection JSON to Frontend
   |
   v
7. Frontend renders detections
   |
   v
8. User clicks "Analyze" -> POST /analyze & /recommend with Detection JSON
   |
   v
9. Backend: llm_analyzer.py -> Calls Perplexity API
   |
   v
10. Backend: recommend_hybrid.py -> Generates recommendations
    |
    v
11. Backend -> Returns Analysis & Recommendation JSON to Frontend
    |
    v
12. Frontend renders the final analysis and suggestions
```

### 5.2 Machine Learning Models
- **`YoloF.pt`**: A custom YOLO model, likely fine-tuned on a fashion-specific dataset. It serves as the primary detector for clothing items.
- **`yolov8s.pt` / `yolov8n.pt`**: Pre-trained general-purpose YOLOv8 models (small and nano) used as part of the ensemble to detect common objects and people that the fashion model might miss.
- **Zero-Shot Classifier Model**: A model from the Hugging Face Hub (e.g., a CLIP-based model) used in `classify.py` to refine generic clothing detections into specific categories without needing explicit training data for each one.
- **`MTCNN`**: A robust, pre-trained model for accurate face detection.

### 5.3 Data Models (Pydantic)
FastAPI uses Pydantic models for request and response validation, ensuring data integrity.
- **`AnalyzeRequest`**: Defines the expected structure for the `/analyze` endpoint, requiring a `detections` dictionary.
- **`RecommendRequest`**: Defines the structure for the `/recommend` endpoint, including `detections`, `occasion`, and items to `exclude`.

---

## 6. Infrastructure and Deployment

### 6.1 Development Environment
- **Backend**: Run locally using `uvicorn main:app --reload`.
- **Frontend**: Run locally using `npm run dev` (Vite's dev server).
- **Dependencies**: Python packages are installed via `pip install -r requirements.txt`. Node.js packages are installed via `npm install`.

### 6.2 Deployment Strategy (Proposed)
- **Containerization**: The backend and frontend can be containerized using **Docker** for consistency and portability.
- **Hosting**:
  - **Backend**: Deploy the Docker container to a cloud service like **Google Cloud Run**, **AWS Fargate**, or a **Virtual Private Server (VPS)**. These services can auto-scale based on traffic.
  - **Frontend**: Deploy the static build output (`dist` folder) to a static hosting provider like **Vercel**, **Netlify**, or **AWS S3/CloudFront** for high performance and low cost.
- **CI/CD**: A CI/CD pipeline (e.g., using **GitHub Actions**) can be set up to automatically build, test, and deploy the application upon pushes to the `main` branch.

### 6.3 Scalability Considerations
- **Stateless Backend**: The API is stateless, allowing for horizontal scaling by simply running more instances of the container.
- **Model Loading**: Models are loaded into memory at startup. For a large-scale deployment, a dedicated model serving solution (e.g., **NVIDIA Triton Inference Server**) could be used to optimize GPU utilization.
- **Caching**: API responses (especially from the LLM) could be cached (e.g., using **Redis**) to reduce latency and cost for repeated requests.

---

## 7. Security
- **API Security**: FastAPI provides automatic input validation through Pydantic models, preventing many common injection attacks. CORS is configured to only allow requests from the deployed frontend's origin.
- **Privacy**: User privacy is a core concern, addressed by the mandatory and automatic face-blurring step. Uploaded images are processed and should not be stored long-term.
- **Communication**: All client-server communication should be over **HTTPS**.

---

## 8. Future Architectural Improvements
- **ML-based Recommendations**: Replace the placeholder `retrieve_similar_items` function with a true ML-based retrieval system using **Fashion-CLIP** to generate embeddings and **FAISS** for efficient similarity search.
- **User Accounts**: Introduce a database (e.g., **PostgreSQL** or **MongoDB**) and an authentication layer (e.g., **JWT**) to support user profiles, saved history, and personalized preferences.
- **Asynchronous Task Queue**: For long-running processes, offload model inference to a background task queue (e.g., **Celery** with **Redis**) to prevent blocking API responses.
- **Dedicated Model Serving**: For high-throughput inference, deploy models on a dedicated service like **NVIDIA Triton** or **TorchServe**.
- **GraphQL API**: Consider transitioning to GraphQL to give the frontend more control over the data it fetches, reducing over-fetching and under-fetching.
