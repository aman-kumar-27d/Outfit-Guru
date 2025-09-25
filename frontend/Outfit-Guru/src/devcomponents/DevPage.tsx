import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DetectionTester from './DetectionTester';
import ResponseViewer from './ResponseViewer';
import type { DetectionResult, RequestInfo } from './types';

const DevPage: React.FC = () => {
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [requestInfo, setRequestInfo] = useState<RequestInfo | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Developer Testing Page</h1>
          <Link 
            to="/" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Back to Main App
          </Link>
        </div>

        <DetectionTester 
          onResult={setResult} 
          onImageSelect={setSelectedImage}
          onRequestInfo={setRequestInfo}
        />
        
        {result && (
          <ResponseViewer 
            result={result} 
            imageFile={selectedImage}
            requestInfo={requestInfo}
          />
        )}
      </div>
    </div>
  );
};

export default DevPage;