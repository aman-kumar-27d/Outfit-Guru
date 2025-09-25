import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import Callout from '../components/Callout';

const InstallationPage: React.FC = () => {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Installation
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Get Outfit Guru running on your local machine or server
      </p>

      <div className="not-prose mb-8">
        <Callout type="info" title="Prerequisites">
          <p>Before you begin, ensure you have the following installed:</p>
          <ul className="mt-2 space-y-1">
            <li>• Python 3.8 or higher</li>
            <li>• Node.js 16 or higher</li>
            <li>• Git</li>
            <li>• At least 8GB of RAM (recommended)</li>
            <li>• GPU with CUDA support (optional, for faster processing)</li>
          </ul>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Clone the Repository
      </h2>

      <p>First, clone the Outfit Guru repository from GitHub:</p>

      <div className="not-prose mb-6">
        <CodeBlock language="bash">
{`git clone https://github.com/aman-kumar-27d/Outfit-Guru.git
cd Outfit-Guru`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Backend Setup
      </h2>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        1. Python Environment
      </h3>

      <p>Create and activate a virtual environment:</p>

      <div className="not-prose mb-4">
        <CodeBlock language="bash">
{`# Create virtual environment
python -m venv outfit-guru-env

# Activate virtual environment
# On Windows
outfit-guru-env\\Scripts\\activate

# On macOS/Linux
source outfit-guru-env/bin/activate`}
        </CodeBlock>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        2. Install Dependencies
      </h3>

      <p>Navigate to the backend directory and install Python dependencies:</p>

      <div className="not-prose mb-4">
        <CodeBlock language="bash">
{`cd backend
pip install -r requirements.txt`}
        </CodeBlock>
      </div>

      <div className="not-prose mb-6">
        <Callout type="warning" title="CUDA Support">
          <p>
            If you have a CUDA-compatible GPU and want to enable GPU acceleration, 
            install the CUDA version of PyTorch:
          </p>
          <div className="mt-2">
            <CodeBlock language="bash">
{`pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118`}
            </CodeBlock>
          </div>
        </Callout>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        3. Download Model Weights
      </h3>

      <p>
        The YOLO models are already included in the <InlineCode>weights/</InlineCode> directory. 
        If you need to download additional or updated models:
      </p>

      <div className="not-prose mb-6">
        <CodeBlock language="bash">
{`# Create weights directory if it doesn't exist
mkdir -p weights

# Download YOLOv8 models (optional - already included)
# wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt -O weights/yolov8n.pt
# wget https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8s.pt -O weights/yolov8s.pt`}
        </CodeBlock>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        4. Environment Variables
      </h3>

      <p>Create a <InlineCode>.env</InlineCode> file in the backend directory:</p>

      <div className="not-prose mb-6">
        <CodeBlock language="bash" filename="backend/.env">
{`# API Configuration
API_HOST=localhost
API_PORT=8000
DEBUG=True

# Model Configuration
MODEL_PATH=weights/yolov8s.pt
CONFIDENCE_THRESHOLD=0.5
IOU_THRESHOLD=0.4

# Upload Configuration
UPLOAD_DIR=../blurred_uploads
MAX_FILE_SIZE=10485760  # 10MB

# LLM Configuration (Optional)
PERPLEXITY_API_KEY=your_perplexity_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Frontend Setup
      </h2>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        1. Install Dependencies
      </h3>

      <p>Navigate to the frontend directory and install Node.js dependencies:</p>

      <div className="not-prose mb-4">
        <CodeBlock language="bash">
{`cd ../frontend/Outfit-Guru
npm install`}
        </CodeBlock>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        2. Environment Configuration
      </h3>

      <p>Create a <InlineCode>.env</InlineCode> file in the frontend directory:</p>

      <div className="not-prose mb-6">
        <CodeBlock language="bash" filename="frontend/Outfit-Guru/.env">
{`# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=30000

# Development Configuration
VITE_DEV_MODE=true
VITE_ENABLE_LOGS=true`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Running the Application
      </h2>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        1. Start the Backend Server
      </h3>

      <p>In the backend directory, start the FastAPI server:</p>

      <div className="not-prose mb-4">
        <CodeBlock language="bash">
{`cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000`}
        </CodeBlock>
      </div>

      <p>The backend API will be available at <InlineCode>http://localhost:8000</InlineCode></p>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        2. Start the Frontend Development Server
      </h3>

      <p>In a new terminal, navigate to the frontend directory and start the development server:</p>

      <div className="not-prose mb-4">
        <CodeBlock language="bash">
{`cd frontend/Outfit-Guru
npm run dev`}
        </CodeBlock>
      </div>

      <p>The frontend will be available at <InlineCode>http://localhost:5173</InlineCode></p>

      <div className="not-prose mb-8">
        <Callout type="success" title="Success!">
          <p>
            If both servers start successfully, you should be able to access the Outfit Guru 
            application at <code>http://localhost:5173</code> and the API documentation 
            at <code>http://localhost:8000/docs</code>.
          </p>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Docker Installation (Alternative)
      </h2>

      <p>
        For a simpler setup process, you can use Docker to run both the frontend and backend:
      </p>

      <div className="not-prose mb-4">
        <CodeBlock language="bash" filename="docker-compose.yml">
{`version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - API_HOST=0.0.0.0
      - API_PORT=8000
    volumes:
      - ./blurred_uploads:/app/blurred_uploads
      - ./data:/app/data

  frontend:
    build:
      context: ./frontend/Outfit-Guru
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000
    depends_on:
      - backend`}
        </CodeBlock>
      </div>

      <div className="not-prose mb-6">
        <CodeBlock language="bash">
{`# Build and run with Docker Compose
docker-compose up --build

# Run in background
docker-compose up -d --build`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Troubleshooting
      </h2>

      <div className="not-prose space-y-4">
        <Callout type="warning" title="Common Issues">
          <div className="space-y-3">
            <div>
              <strong>Port already in use:</strong>
              <p className="text-sm mt-1">
                If you get a "port already in use" error, either kill the process using the port 
                or change the port in your configuration files.
              </p>
            </div>
            
            <div>
              <strong>CUDA out of memory:</strong>
              <p className="text-sm mt-1">
                If you encounter GPU memory issues, try reducing the batch size or switching 
                to CPU mode by setting <code>DEVICE=cpu</code> in your environment variables.
              </p>
            </div>
            
            <div>
              <strong>Module not found errors:</strong>
              <p className="text-sm mt-1">
                Ensure your virtual environment is activated and all dependencies are installed. 
                Try <code>pip install -r requirements.txt</code> again.
              </p>
            </div>
          </div>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Next Steps
      </h2>

      <p>
        Now that you have Outfit Guru installed, check out the{' '}
        <a href="/docs/quick-start" className="text-blue-600 hover:underline">
          Quick Start Guide
        </a>{' '}
        to learn how to use the application, or explore the{' '}
        <a href="/docs/api/backend" className="text-blue-600 hover:underline">
          API Documentation
        </a>{' '}
        for advanced integration options.
      </p>
    </div>
  );
};

export default InstallationPage;