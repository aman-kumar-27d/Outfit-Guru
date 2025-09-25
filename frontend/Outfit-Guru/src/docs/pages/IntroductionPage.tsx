import React from 'react';
import CodeBlock from '../components/CodeBlock';
import ImagePreview from '../components/ImagePreview';
import Callout from '../components/Callout';

const IntroductionPage: React.FC = () => {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Welcome to Outfit Guru
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        AI-powered outfit detection and style analysis platform
      </p>

      <div className="not-prose mb-8">
        <ImagePreview
          src="/docs/images/homepage/PLACEHOLDER_homepage_dashboard_800x500_light.png"
          alt="Outfit Guru Dashboard"
          caption="Outfit Guru's intuitive interface for outfit detection and analysis"
          className="mb-6"
        />
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        What is Outfit Guru?
      </h2>
      
      <p>
        Outfit Guru is a comprehensive AI-powered platform that revolutionizes how we analyze and 
        understand fashion choices. Built with cutting-edge computer vision and machine learning 
        technologies, it provides intelligent outfit detection, style analysis, and personalized 
        recommendations.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Key Features
      </h2>

      <div className="grid md:grid-cols-2 gap-6 not-prose mb-8">
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🔍 AI Outfit Detection</h3>
          <p className="text-gray-600">
            Advanced YOLO-based computer vision models to detect and classify clothing items 
            with high accuracy.
          </p>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🎨 Style Analysis</h3>
          <p className="text-gray-600">
            Comprehensive style analysis powered by large language models to understand 
            fashion trends and aesthetics.
          </p>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🔒 Privacy Protection</h3>
          <p className="text-gray-600">
            Built-in face blurring technology to protect user privacy while maintaining 
            outfit analysis accuracy.
          </p>
        </div>
        
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">💡 Smart Recommendations</h3>
          <p className="text-gray-600">
            Personalized outfit suggestions based on detected items, style preferences, 
            and current fashion trends.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Technology Stack
      </h2>

      <div className="not-prose">
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Frontend</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>React + TypeScript</div>
              <div>Tailwind CSS</div>
              <div>Vite</div>
            </div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Backend</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>FastAPI + Python</div>
              <div>PyTorch</div>
              <div>OpenCV</div>
            </div>
          </div>
          
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">AI/ML</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>YOLOv8</div>
              <div>LLM Integration</div>
              <div>Computer Vision</div>
            </div>
          </div>
        </div>
      </div>

      <div className="not-prose mb-8">
        <Callout type="tip" title="Quick Start">
          <p>
            Ready to get started? Check out our{' '}
            <a href="/docs/installation" className="text-blue-600 hover:underline">
              Installation Guide
            </a>{' '}
            to set up Outfit Guru locally, or jump straight to the{' '}
            <a href="/docs/quick-start" className="text-blue-600 hover:underline">
              Quick Start
            </a>{' '}
            tutorial.
          </p>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Quick Example
      </h2>

      <p>Here's a simple example of how to use Outfit Guru's API:</p>

      <div className="not-prose mb-6">
        <CodeBlock language="python" filename="example.py">
{`import requests

# Upload an image for outfit detection
url = "http://localhost:8000/api/detect-outfit"
files = {"file": open("outfit_image.jpg", "rb")}

response = requests.post(url, files=files)
result = response.json()

print(f"Detected items: {result['detected_items']}")
print(f"Style analysis: {result['style_analysis']}")`}
        </CodeBlock>
      </div>

      <div className="not-prose">
        <Callout type="info">
          <p>
            This is just a basic example. Outfit Guru provides many more features including 
            batch processing, style recommendations, and advanced analytics. Explore the 
            documentation to learn more!
          </p>
        </Callout>
      </div>

      <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">
        Next Steps
      </h2>

      <div className="not-prose">
        <div className="grid md:grid-cols-2 gap-4">
          <a 
            href="/docs/installation" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">📦 Installation</h3>
            <p className="text-gray-600 text-sm">
              Set up Outfit Guru on your local machine or server
            </p>
          </a>
          
          <a 
            href="/docs/quick-start" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🚀 Quick Start</h3>
            <p className="text-gray-600 text-sm">
              Get up and running with your first outfit detection
            </p>
          </a>
          
          <a 
            href="/docs/api/backend" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">📖 API Reference</h3>
            <p className="text-gray-600 text-sm">
              Comprehensive API documentation and examples
            </p>
          </a>
          
          <a 
            href="/docs/components" 
            className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <h3 className="font-semibold text-gray-900 mb-2">🧩 Components</h3>
            <p className="text-gray-600 text-sm">
              Reusable UI components and design system
            </p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default IntroductionPage;