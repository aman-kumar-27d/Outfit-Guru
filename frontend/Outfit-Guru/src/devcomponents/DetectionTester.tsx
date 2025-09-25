import React, { useState } from 'react';
import type { DetectionResult, RequestInfo } from './types';

interface DetectionTesterProps {
  onResult: (result: DetectionResult | null) => void;
  onImageSelect: (file: File | null) => void;
  onRequestInfo: (info: RequestInfo | null) => void;
}

const DetectionTester: React.FC<DetectionTesterProps> = ({ onResult, onImageSelect, onRequestInfo }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onResult(null);
      onImageSelect(file);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    const startTime = Date.now();
    const timestamp = new Date();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DetectionResult = await response.json();
      onResult(data);
      
      // Pass request info
      onRequestInfo({
        endpoint: 'http://localhost:8000/detect',
        method: 'POST',
        timestamp,
        responseTime,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      onResult(null);
      onRequestInfo(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Test /detect Endpoint</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Image File
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {selectedFile && (
          <div className="text-sm text-gray-600">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded transition-colors"
        >
          {loading ? 'Processing...' : 'Send Request'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetectionTester;