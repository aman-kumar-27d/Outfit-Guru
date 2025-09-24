import React, { useState, useEffect } from 'react';
import { Copy, Check, Image as ImageIcon, Palette, Eye, Code2, BarChart3 } from 'lucide-react';
import type { DetectionResult, RequestInfo } from './types';
import SyntaxHighlighter from './SyntaxHighlighter';
import RequestDetails from './RequestDetails';

interface ResponseViewerProps {
  result: DetectionResult;
  imageFile: File | null;
  requestInfo: RequestInfo | null;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ result, imageFile, requestInfo }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const formatJSON = (obj: any) => {
    return JSON.stringify(obj, null, 2);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatJSON(result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Request Details */}
      {requestInfo && (
        <RequestDetails
          endpoint={requestInfo.endpoint}
          method={requestInfo.method}
          timestamp={requestInfo.timestamp}
          responseTime={requestInfo.responseTime}
          fileName={requestInfo.fileName}
          fileSize={requestInfo.fileSize}
          detectionResult={result}
          imageFile={imageFile}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Response from /detect</h3>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              Visual Preview
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === 'json'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              JSON Response
            </button>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-900">Dimensions</h4>
              </div>
              <p className="text-2xl font-bold text-blue-800">{result.width} x {result.height}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Raw</h4>
              </div>
              <p className="text-2xl font-bold text-green-800">{result.raw_detections.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-yellow-600" />
                <h4 className="font-semibold text-yellow-900">Filtered</h4>
              </div>
              <p className="text-2xl font-bold text-yellow-800">{result.filtered_detections.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">Persons</h4>
              </div>
              <p className="text-2xl font-bold text-purple-800">{result.person_regions.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Preview with Bounding Boxes */}
            {imagePreview && (
              <div>
                <h4 className="text-lg font-semibold mb-3">Image Preview with Detections</h4>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Uploaded preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                  
                  {/* Render bounding boxes */}
                  {result.refined_detections.map((detection, index) => {
                    const [x1, y1, x2, y2] = detection.bbox;
                    const img = document.querySelector('img') as HTMLImageElement;
                    if (!img) return null;
                    
                    const scaleX = img.clientWidth / result.width;
                    const scaleY = img.clientHeight / result.height;
                    
                    return (
                      <div
                        key={index}
                        className="absolute border-2 border-blue-400 bg-blue-500/20"
                        style={{
                          left: `${x1 * scaleX}px`,
                          top: `${y1 * scaleY}px`,
                          width: `${(x2 - x1) * scaleX}px`,
                          height: `${(y2 - y1) * scaleY}px`,
                        }}
                      >
                        <span className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                          {detection.refined_label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Detection Cards */}
            <div>
              <h4 className="text-lg font-semibold mb-3">Detected Items ({result.refined_detections.length})</h4>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {result.refined_detections.map((detection, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200 bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h5 className="font-semibold text-gray-900 capitalize">{detection.refined_label}</h5>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {Math.round(detection.refined_confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Model: <span className="font-medium">{detection.source_model}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        BBox: [{detection.bbox.join(', ')}]
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {detection.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center"
                            style={{ backgroundColor: color.hex }}
                            title={`Color: ${color.hex}`}
                          >
                            <Palette className="w-3 h-3 text-white drop-shadow-sm" />
                          </div>
                          <span className="text-xs text-gray-400 font-mono">
                            {color.hex}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Person Regions */}
          {result.person_regions.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold mb-3">Person Region Analysis</h4>
              <div className="space-y-4">
                {result.person_regions.map((person, personIndex) => (
                  <div key={personIndex} className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-medium text-gray-900 mb-3">Person {personIndex + 1}</h5>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(person.regions).map(([regionName, regionData]) => (
                        <div key={regionName} className="text-center">
                          <div
                            className="w-16 h-16 rounded-lg border-2 border-gray-200 shadow-sm mx-auto mb-2 flex items-center justify-center"
                            style={{ backgroundColor: regionData.dominant_color_hex }}
                          >
                            <Palette className="w-6 h-6 text-white drop-shadow-sm" />
                          </div>
                          <p className="text-sm font-medium capitalize text-gray-900">{regionName}</p>
                          <p className="text-xs text-gray-500">{regionData.dominant_color_hex}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            [{regionData.bbox.join(', ')}]
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'json' && (
        <div>
          <SyntaxHighlighter code={formatJSON(result)} />
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;