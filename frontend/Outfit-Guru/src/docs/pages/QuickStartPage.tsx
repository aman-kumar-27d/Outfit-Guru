import React from 'react';
import CodeBlock, { InlineCode } from '../components/CodeBlock';
import ImagePreview, { ImageGrid } from '../components/ImagePreview';
import Callout from '../components/Callout';

const QuickStartPage: React.FC = () => {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Quick Start Guide
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Get up and running with Outfit Guru in just a few minutes
      </p>

      <div className="not-prose mb-8">
        <Callout type="info" title="Before You Start">
          <p>
            Make sure you have completed the{' '}
            <a href="/docs/installation" className="text-blue-600 hover:underline">
              Installation Guide
            </a>{' '}
            and have both the backend and frontend servers running.
          </p>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Step 1: Access the Application
      </h2>

      <p>
        Open your web browser and navigate to{' '}
        <InlineCode>http://localhost:5173</InlineCode> (or the port you configured). 
        You should see the Outfit Guru homepage.
      </p>

      <div className="not-prose mb-6">
        <ImagePreview
          src="/docs/images/homepage/PLACEHOLDER_homepage_dashboard_800x500_light.png"
          alt="Outfit Guru Homepage"
          caption="The Outfit Guru homepage with navigation and main features"
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Step 2: Upload Your First Image
      </h2>

      <p>
        Click on the "Try Outfit Detection" button or navigate to the detection section. 
        You can upload an image in several ways:
      </p>

      <ul>
        <li><strong>Drag and Drop:</strong> Simply drag an image file onto the upload area</li>
        <li><strong>Click to Browse:</strong> Click the upload button to select a file</li>
        <li><strong>Paste from Clipboard:</strong> Use Ctrl+V to paste an image</li>
      </ul>

      <div className="not-prose mb-6">
        <ImageGrid
          images={[
            {
              src: "/docs/images/quickstart/PLACEHOLDER_quickstart_upload_interface_600x400_clean.png",
              alt: "Upload interface",
              caption: "Drag and drop interface for image upload"
            },
            {
              src: "/docs/images/quickstart/PLACEHOLDER_quickstart_file_browser_400x300_dialog.png", 
              alt: "File browser",
              caption: "File browser for selecting images"
            }
          ]}
          columns={2}
        />
      </div>

      <div className="not-prose mb-6">
        <Callout type="tip" title="Supported Formats">
          <p>
            Outfit Guru supports common image formats: JPEG, PNG, WebP, and GIF. 
            Maximum file size is 10MB. For best results, use high-resolution images 
            with clear visibility of clothing items.
          </p>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Step 3: Configure Detection Settings
      </h2>

      <p>Before running detection, you can adjust various settings:</p>

      <div className="not-prose mb-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Detection Settings</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Confidence Threshold (0.3-0.9)</li>
              <li>• Face Blurring (On/Off)</li>
              <li>• Model Selection (YOLOv8n/s/m)</li>
              <li>• Output Format (JSON/Visual)</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Analysis Options</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Style Analysis (LLM-powered)</li>
              <li>• Color Palette Extraction</li>
              <li>• Outfit Recommendations</li>
              <li>• Trend Analysis</li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Step 4: Run Outfit Detection
      </h2>

      <p>
        Click the "Analyze Outfit" button to start the detection process. 
        The system will:
      </p>

      <ol>
        <li>Upload and preprocess your image</li>
        <li>Apply face blurring (if enabled)</li>
        <li>Run YOLO object detection</li>
        <li>Perform style analysis (if enabled)</li>
        <li>Generate recommendations</li>
      </ol>

      <div className="not-prose mb-6">
        <ImagePreview
          src="/docs/images/quickstart/PLACEHOLDER_quickstart_processing_progress_600x400_realtime.png"
          alt="Processing interface"
          caption="Real-time processing with progress indicators"
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Step 5: View Results
      </h2>

      <p>Once processing is complete, you'll see comprehensive results including:</p>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Detection Results
      </h3>

      <div className="not-prose mb-4">
        <ImagePreview
          src="/docs/images/quickstart/PLACEHOLDER_quickstart_results_analysis_800x600_complete.png"
          alt="Detection results"
          caption="Detected clothing items with bounding boxes and confidence scores"
        />
      </div>

      <p>The detection results show:</p>
      <ul>
        <li>Bounding boxes around detected items</li>
        <li>Item labels (shirt, pants, shoes, etc.)</li>
        <li>Confidence scores for each detection</li>
        <li>Color information and style attributes</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
        Style Analysis
      </h3>

      <div className="not-prose mb-4">
        <CodeBlock language="json" filename="style_analysis.json">
{`{
  "overall_style": "Casual Business",
  "color_scheme": "Monochromatic",
  "key_pieces": [
    {
      "item": "blazer",
      "color": "navy blue",
      "style": "fitted",
      "confidence": 0.94
    },
    {
      "item": "trousers",
      "color": "charcoal",
      "style": "straight-leg",
      "confidence": 0.89
    }
  ],
  "style_score": 8.5,
  "recommendations": [
    "Consider adding a pop of color with accessories",
    "Brown leather shoes would complement this outfit",
    "A subtle pattern tie could add visual interest"
  ]
}`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Step 6: Explore Advanced Features
      </h2>

      <div className="not-prose mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">🔄 Batch Processing</h4>
            <p className="text-sm text-gray-600">
              Upload multiple images for batch analysis and comparison
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">📊 Analytics Dashboard</h4>
            <p className="text-sm text-gray-600">
              View detailed analytics and trends across your outfit analyses
            </p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">💾 Export Results</h4>
            <p className="text-sm text-gray-600">
              Export detection results in various formats (JSON, CSV, PDF)
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Using the API Directly
      </h2>

      <p>
        For developers, you can interact with the Outfit Guru API directly. 
        Here's a simple example using Python:
      </p>

      <div className="not-prose mb-4">
        <CodeBlock language="python" filename="api_example.py">
{`import requests
import json

# Upload and analyze an outfit
url = "http://localhost:8000/api/detect-outfit"

# Prepare the request
files = {"file": open("my_outfit.jpg", "rb")}
data = {
    "confidence_threshold": 0.5,
    "enable_face_blur": True,
    "enable_style_analysis": True
}

# Make the request
response = requests.post(url, files=files, data=data)

if response.status_code == 200:
    result = response.json()
    
    # Print detected items
    print("Detected Items:")
    for item in result["detected_items"]:
        print(f"  - {item['label']}: {item['confidence']:.2f}")
    
    # Print style analysis
    if "style_analysis" in result:
        print(f"\\nStyle: {result['style_analysis']['overall_style']}")
        print(f"Score: {result['style_analysis']['style_score']}")
else:
    print(f"Error: {response.status_code} - {response.text}")`}
        </CodeBlock>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Command Line Interface
      </h2>

      <p>
        Outfit Guru also provides a CLI for batch processing and automation:
      </p>

      <div className="not-prose mb-4">
        <CodeBlock language="bash">
{`# Analyze a single image
python -m outfit_guru.cli analyze --input my_outfit.jpg --output results.json

# Batch process a directory
python -m outfit_guru.cli batch --input-dir ./images --output-dir ./results

# Generate a report
python -m outfit_guru.cli report --input results.json --format pdf`}
        </CodeBlock>
      </div>

      <div className="not-prose mb-8">
        <Callout type="success" title="Congratulations!">
          <p>
            You've successfully completed your first outfit analysis with Outfit Guru! 
            You now know the basic workflow and can start exploring more advanced features.
          </p>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Next Steps
      </h2>

      <div className="not-prose">
        <div className="grid md:grid-cols-2 gap-4">
          <a 
            href="/docs/outfit-detection" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🔍 Deep Dive: Outfit Detection</h3>
            <p className="text-gray-600 text-sm">
              Learn about the AI models and detection algorithms
            </p>
          </a>
          
          <a 
            href="/docs/api/backend" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">📖 API Documentation</h3>
            <p className="text-gray-600 text-sm">
              Complete API reference and advanced usage examples
            </p>
          </a>
          
          <a 
            href="/docs/components" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🧩 UI Components</h3>
            <p className="text-gray-600 text-sm">
              Integrate Outfit Guru components into your own applications
            </p>
          </a>
          
          <a 
            href="/docs/deployment/docker" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🚀 Deployment Guide</h3>
            <p className="text-gray-600 text-sm">
              Deploy Outfit Guru to production environments
            </p>
          </a>
        </div>
      </div>

      <div className="not-prose mt-8">
        <Callout type="tip" title="Need Help?">
          <p>
            If you encounter any issues or have questions, check out our{' '}
            <a href="/docs/contributing" className="text-blue-600 hover:underline">
              troubleshooting section
            </a>{' '}
            or reach out to the community for support.
          </p>
        </Callout>
      </div>
    </div>
  );
};

export default QuickStartPage;