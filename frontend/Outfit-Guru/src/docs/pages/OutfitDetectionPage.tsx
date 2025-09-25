import React from 'react';
import CodeBlock from '../components/CodeBlock';
import ImagePreview from '../components/ImagePreview';
import Callout from '../components/Callout';

const OutfitDetectionPage: React.FC = () => {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Outfit Detection
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        AI-powered clothing item detection using advanced computer vision models
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Overview
      </h2>

      <p>
        Outfit Guru's detection system uses state-of-the-art YOLO (You Only Look Once) models 
        to identify and classify clothing items in images. The system can detect various clothing 
        categories including tops, bottoms, footwear, accessories, and more.
      </p>

      <div className="not-prose mb-6">
        <ImagePreview
          src="/docs/images/detection/PLACEHOLDER_detection_example_result_800x500_annotated.jpg"
          alt="Outfit detection example"
          caption="Example of outfit detection with bounding boxes and labels"
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Supported Clothing Categories
      </h2>

      <div className="not-prose mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">👕 Tops</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Shirts</li>
              <li>• T-shirts</li>
              <li>• Tops</li>
              <li>• Sweaters</li>
              <li>• Jackets</li>
              <li>• Blazers</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">👖 Bottoms</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Pants</li>
              <li>• Jeans</li>
              <li>• Shorts</li>
              <li>• Skirts</li>
              <li>• Dresses</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">👟 Accessories</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Shoes</li>
              <li>• Bags</li>
              <li>• Hats</li>
              <li>• Belts</li>
              <li>• Jewelry</li>
              <li>• Sunglasses</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Model Architecture
      </h2>

      <p>
        The detection system is built on YOLOv8, which provides an excellent balance 
        between accuracy and speed. We offer different model variants:
      </p>

      <div className="not-prose mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Model</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Size</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Speed</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Accuracy</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">Use Case</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-3 font-mono text-sm">YOLOv8n</td>
                <td className="px-4 py-3 text-sm">6.2MB</td>
                <td className="px-4 py-3 text-sm">⚡ Fast</td>
                <td className="px-4 py-3 text-sm">📊 Good</td>
                <td className="px-4 py-3 text-sm">Real-time applications</td>
              </tr>
              <tr className="border-t border-gray-200 bg-blue-50">
                <td className="px-4 py-3 font-mono text-sm font-semibold">YOLOv8s</td>
                <td className="px-4 py-3 text-sm">21.5MB</td>
                <td className="px-4 py-3 text-sm">⚡ Balanced</td>
                <td className="px-4 py-3 text-sm">📊 Better</td>
                <td className="px-4 py-3 text-sm">Recommended (Default)</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="px-4 py-3 font-mono text-sm">YOLOv8m</td>
                <td className="px-4 py-3 text-sm">49.7MB</td>
                <td className="px-4 py-3 text-sm">⚡ Slower</td>
                <td className="px-4 py-3 text-sm">📊 Best</td>
                <td className="px-4 py-3 text-sm">High-accuracy needs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="not-prose mb-6">
        <Callout type="tip" title="Model Selection">
          <p>
            For most use cases, we recommend YOLOv8s as it provides the best balance 
            between speed and accuracy. Use YOLOv8n for real-time applications where 
            speed is critical, or YOLOv8m when maximum accuracy is required.
          </p>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Detection Process
      </h2>

      <p>The outfit detection process consists of several stages:</p>

      <div className="not-prose mb-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Image Preprocessing</h4>
              <p className="text-sm text-gray-600">
                Resize, normalize, and prepare the image for model inference. Apply face 
                blurring if enabled for privacy protection.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Object Detection</h4>
              <p className="text-sm text-gray-600">
                Run the YOLO model to detect clothing items and generate bounding boxes 
                with confidence scores.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Post-processing</h4>
              <p className="text-sm text-gray-600">
                Apply Non-Maximum Suppression (NMS) to remove duplicate detections and 
                filter results by confidence threshold.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              4
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Result Generation</h4>
              <p className="text-sm text-gray-600">
                Format detection results with labels, coordinates, confidence scores, 
                and additional metadata.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Configuration Parameters
      </h2>

      <p>You can customize the detection behavior using various parameters:</p>

      <div className="not-prose mb-6">
        <CodeBlock language="python" filename="detection_config.py">
{`# Detection configuration
DETECTION_CONFIG = {
    # Model settings
    "model_path": "weights/yolov8s.pt",
    "device": "cuda",  # or "cpu"
    
    # Detection parameters
    "confidence_threshold": 0.5,    # Minimum confidence for detections
    "iou_threshold": 0.4,           # IoU threshold for NMS
    "max_detections": 300,          # Maximum number of detections
    
    # Image processing
    "input_size": 640,              # Model input size (640x640)
    "enable_face_blur": True,       # Privacy protection
    "blur_strength": 15,            # Gaussian blur kernel size
    
    # Output settings
    "save_annotated_image": True,   # Save image with bounding boxes
    "include_crops": False,         # Include cropped detected items
    "output_format": "json"         # json, xml, or csv
}`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        API Usage
      </h2>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Basic Detection Request
      </h3>

      <div className="not-prose mb-4">
        <CodeBlock language="python" filename="basic_detection.py">
{`import requests
import json

# Prepare the image and parameters
url = "http://localhost:8000/api/detect-outfit"
files = {"file": open("outfit_image.jpg", "rb")}
data = {
    "confidence_threshold": 0.5,
    "enable_face_blur": True,
    "model": "yolov8s"
}

# Make the request
response = requests.post(url, files=files, data=data)

if response.status_code == 200:
    result = response.json()
    print(json.dumps(result, indent=2))
else:
    print(f"Error: {response.status_code}")`}
        </CodeBlock>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Response Format
      </h3>

      <div className="not-prose mb-6">
        <CodeBlock language="json" filename="detection_response.json">
{`{
  "success": true,
  "processing_time": 1.23,
  "image_info": {
    "width": 800,
    "height": 600,
    "format": "JPEG"
  },
  "detected_items": [
    {
      "id": 0,
      "label": "shirt",
      "confidence": 0.92,
      "bbox": {
        "x1": 150,
        "y1": 100,
        "x2": 350,
        "y2": 300
      },
      "center": {
        "x": 250,
        "y": 200
      },
      "area": 40000,
      "color_info": {
        "dominant_color": "#4A90E2",
        "color_name": "blue",
        "color_palette": ["#4A90E2", "#FFFFFF", "#2C3E50"]
      }
    }
  ],
  "statistics": {
    "total_items": 5,
    "categories": {
      "tops": 2,
      "bottoms": 1,
      "shoes": 1,
      "accessories": 1
    }
  },
  "annotated_image_url": "/blurred_uploads/abc123_annotated.jpg"
}`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Advanced Features
      </h2>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Batch Processing
      </h3>

      <p>Process multiple images in a single request:</p>

      <div className="not-prose mb-4">
        <CodeBlock language="python" filename="batch_detection.py">
{`import requests

url = "http://localhost:8000/api/batch-detect"
files = [
    ("files", open("outfit1.jpg", "rb")),
    ("files", open("outfit2.jpg", "rb")),
    ("files", open("outfit3.jpg", "rb"))
]

data = {
    "confidence_threshold": 0.6,
    "enable_style_analysis": True
}

response = requests.post(url, files=files, data=data)
results = response.json()

for i, result in enumerate(results["batch_results"]):
    print(f"Image {i+1}: {len(result['detected_items'])} items detected")`}
        </CodeBlock>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Custom Model Integration
      </h3>

      <p>You can integrate your own trained models:</p>

      <div className="not-prose mb-4">
        <CodeBlock language="python" filename="custom_model.py">
{`from outfit_guru.models import CustomDetector

# Load your custom model
detector = CustomDetector(
    model_path="path/to/your/model.pt",
    config_path="path/to/config.yaml"
)

# Register the model
detector.register_model("my_custom_model")

# Use in API
data = {
    "model": "my_custom_model",
    "confidence_threshold": 0.7
}`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Performance Optimization
      </h2>

      <div className="not-prose mb-6">
        <Callout type="info" title="Optimization Tips">
          <div className="space-y-2 text-sm">
            <p><strong>GPU Acceleration:</strong> Use CUDA-enabled PyTorch for 10x faster processing</p>
            <p><strong>Batch Size:</strong> Process multiple images together to improve throughput</p>
            <p><strong>Image Preprocessing:</strong> Resize images to optimal dimensions (640x640)</p>
            <p><strong>Model Selection:</strong> Choose the right model size for your speed/accuracy needs</p>
            <p><strong>Caching:</strong> Enable result caching for frequently processed images</p>
          </div>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Troubleshooting
      </h2>

      <div className="not-prose space-y-4 mb-8">
        <Callout type="warning" title="Common Issues">
          <div className="space-y-3 text-sm">
            <div>
              <strong>Low Detection Accuracy:</strong>
              <ul className="mt-1 ml-4 space-y-1">
                <li>• Try lowering the confidence threshold</li>
                <li>• Use higher resolution images</li>
                <li>• Ensure good lighting and clear visibility</li>
                <li>• Switch to YOLOv8m for better accuracy</li>
              </ul>
            </div>
            
            <div>
              <strong>Slow Processing:</strong>
              <ul className="mt-1 ml-4 space-y-1">
                <li>• Enable GPU acceleration with CUDA</li>
                <li>• Use YOLOv8n for faster processing</li>
                <li>• Reduce image resolution before processing</li>
                <li>• Disable unnecessary features like style analysis</li>
              </ul>
            </div>
            
            <div>
              <strong>Memory Issues:</strong>
              <ul className="mt-1 ml-4 space-y-1">
                <li>• Reduce batch size</li>
                <li>• Use smaller model variant</li>
                <li>• Process images sequentially instead of batch</li>
                <li>• Clear GPU memory between requests</li>
              </ul>
            </div>
          </div>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Next Steps
      </h2>

      <div className="not-prose">
        <div className="grid md:grid-cols-2 gap-4">
          <a 
            href="/docs/style-analysis" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🎨 Style Analysis</h3>
            <p className="text-gray-600 text-sm">
              Learn about AI-powered style analysis and recommendations
            </p>
          </a>
          
          <a 
            href="/docs/face-blur" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🔒 Privacy Protection</h3>
            <p className="text-gray-600 text-sm">
              Understand face blurring and privacy features
            </p>
          </a>
          
          <a 
            href="/docs/api/endpoints" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">📖 API Endpoints</h3>
            <p className="text-gray-600 text-sm">
              Complete API reference for all detection endpoints
            </p>
          </a>
          
          <a 
            href="/docs/components/detection" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🧩 UI Components</h3>
            <p className="text-gray-600 text-sm">
              Frontend components for outfit detection interfaces
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OutfitDetectionPage;