import React, { useState } from 'react';
import { Clock, Globe, FileText, ChevronDown, ChevronRight, Eye, Plus, Minus } from 'lucide-react';
import type { DetectionResult } from './types';

interface RequestDetailsProps {
  endpoint: string;
  method: string;
  timestamp: Date;
  responseTime?: number;
  fileSize?: number;
  fileName?: string;
  detectionResult?: DetectionResult;
  imageFile?: File | null;
}

const RequestDetails: React.FC<RequestDetailsProps> = ({
  endpoint,
  method,
  timestamp,
  responseTime,
  fileSize,
  fileName,
  detectionResult,
  imageFile
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showJSONTree, setShowJSONTree] = useState(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedDetection, setSelectedDetection] = useState<number | null>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const toggleNode = (path: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedNodes(newExpanded);
  };

  const getCountsFromResult = (result: DetectionResult) => {
    return {
      raw_detections: result.raw_detections?.length || 0,
      filtered_detections: result.filtered_detections?.length || 0,
      refined_detections: result.refined_detections?.length || 0,
      person_regions: result.person_regions?.length || 0,
      total_colors: result.refined_detections?.reduce((acc, det) => acc + (det.colors?.length || 0), 0) || 0,
      unique_labels: new Set(result.refined_detections?.map(det => det.refined_label) || []).size,
    };
  };

  const renderJSONNode = (data: any, path: string, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(path);
    const isObject = typeof data === 'object' && data !== null && !Array.isArray(data);
    const isArray = Array.isArray(data);
    const isPrimitive = !isObject && !isArray;

    // Handle primitive values
    if (isPrimitive) {
      return (
        <div className="py-1">
          <span className="text-gray-900 font-mono text-sm">
            {typeof data === 'string' ? `"${data}"` : String(data)}
          </span>
        </div>
      );
    }

    // Special handling for arrays to show them as comma-separated values
    if (isArray) {
      // For arrays of primitives (like bbox, rgb), show inline
      if (data.every((item: any) => typeof item === 'number' || typeof item === 'string')) {
        return (
          <div className="py-1">
            <span className="text-gray-700 font-mono text-sm">
              [{data.join(', ')}]
            </span>
          </div>
        );
      }
      
      // For arrays of objects, show expandable list
      return (
        <div>
          <button
            onClick={() => toggleNode(path)}
            className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded text-sm w-full text-left"
          >
            {isExpanded ? (
              <Minus className="w-4 h-4 text-gray-500" />
            ) : (
              <Plus className="w-4 h-4 text-gray-500" />
            )}
            <span className="font-medium text-gray-700">
              Array [{data.length} items]
            </span>
          </button>
          
          {isExpanded && (
            <div className="mt-2 ml-6 space-y-2">
              {data.map((item: any, index: number) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <div className="text-sm font-medium text-blue-700 mb-1">Item {index + 1}:</div>
                  {renderJSONNode(item, `${path}[${index}]`, depth + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Handle objects with grouped display
    const keys = Object.keys(data);
    const count = keys.length;

    return (
      <div>
        <button
          onClick={() => toggleNode(path)}
          className="flex items-center gap-2 hover:bg-gray-100 px-2 py-1 rounded text-sm w-full text-left"
        >
          {isExpanded ? (
            <Minus className="w-4 h-4 text-gray-500" />
          ) : (
            <Plus className="w-4 h-4 text-gray-500" />
          )}
          <span className="font-medium text-gray-700">
            {path.split('.').pop() || 'Object'} ({count} properties)
          </span>
        </button>
        
        {isExpanded && (
          <div className="mt-2 ml-6 space-y-3">
            {keys.map((key) => {
              const value = data[key];
              const isValueArray = Array.isArray(value);
              const isValueObject = typeof value === 'object' && value !== null && !isValueArray;
              const isValuePrimitive = !isValueArray && !isValueObject;
              
              return (
                <div key={key} className="border-l-2 border-green-200 pl-4">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-semibold text-purple-700 min-w-0 flex-shrink-0">
                      {key}:
                    </span>
                    <div className="flex-1 min-w-0">
                      {/* Inline display for simple values */}
                      {isValuePrimitive && (
                        <span className="text-gray-900 font-mono text-sm">
                          {typeof value === 'string' ? `"${value}"` : String(value)}
                        </span>
                      )}
                      
                      {/* Inline display for simple arrays */}
                      {isValueArray && value.every((item: any) => typeof item === 'number' || typeof item === 'string') && (
                        <span className="text-gray-700 font-mono text-sm">
                          [{value.join(', ')}]
                        </span>
                      )}
                      
                      {/* Expandable for complex structures */}
                      {((isValueArray && !value.every((item: any) => typeof item === 'number' || typeof item === 'string')) || isValueObject) && (
                        <div className="mt-1">
                          {renderJSONNode(value, `${path}.${key}`, depth + 1)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <h4 className="text-sm font-medium text-gray-900">Request Details</h4>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
            {method}
          </span>
          {responseTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {responseTime}ms
            </span>
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Endpoint</p>
              <p className="text-sm font-medium text-gray-900">{endpoint}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-xs text-gray-500">Timestamp</p>
              <p className="text-sm font-medium text-gray-900">
                {timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          
          {fileName && (
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <FileText className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">File</p>
                <p className="text-sm font-medium text-gray-900 truncate" title={fileName}>
                  {fileName}
                </p>
              </div>
            </div>
          )}
          
          {fileSize && (
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500">File Size</p>
              <p className="text-sm font-medium text-gray-900 whitespace-nowrap">
                {formatFileSize(fileSize)}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* JSON Tree Visualization */}
      {detectionResult && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowJSONTree(!showJSONTree)}
            className="w-full flex items-center justify-between text-left mb-3"
          >
            <div className="flex items-center gap-2">
              {showJSONTree ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <h4 className="text-sm font-medium text-gray-900">JSON Tree View</h4>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                Structured Data
              </span>
              {(() => {
                const counts = getCountsFromResult(detectionResult);
                return (
                  <span>
                    {counts.refined_detections} detections, {counts.person_regions} persons
                  </span>
                );
              })()}
            </div>
          </button>

          {showJSONTree && (
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 pb-4 border-b border-gray-200">
                  {(() => {
                    const counts = getCountsFromResult(detectionResult);
                    return (
                      <>
                        <div className="bg-white p-2 rounded text-center">
                          <div className="text-lg font-bold text-blue-600">{counts.refined_detections}</div>
                          <div className="text-xs text-gray-500">Detections</div>
                        </div>
                        <div className="bg-white p-2 rounded text-center">
                          <div className="text-lg font-bold text-green-600">{counts.unique_labels}</div>
                          <div className="text-xs text-gray-500">Unique Labels</div>
                        </div>
                        <div className="bg-white p-2 rounded text-center">
                          <div className="text-lg font-bold text-purple-600">{counts.total_colors}</div>
                          <div className="text-xs text-gray-500">Total Colors</div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Tree Structure */}
                <div className="text-sm">
                  {renderJSONNode(detectionResult, 'root')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bounding Box Visualizer */}
      {detectionResult && imageFile && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className="w-full flex items-center justify-between text-left mb-3"
          >
            <div className="flex items-center gap-2">
              {showBoundingBoxes ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <h4 className="text-sm font-medium text-gray-900">Bounding Box Visualizer</h4>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
                <Eye className="w-3 h-3 inline mr-1" />
                Visual Debug
              </span>
            </div>
          </button>

          {showBoundingBoxes && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Image with Individual Bounding Boxes */}
                <div>
                  <h5 className="text-sm font-medium mb-2">Individual Detection Preview</h5>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {detectionResult.refined_detections.map((detection, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedDetection(selectedDetection === index ? null : index)}
                        className={`w-full p-2 rounded text-left text-xs transition-colors ${
                          selectedDetection === index
                            ? 'bg-blue-100 border-blue-300 border'
                            : 'bg-white hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        <div className="font-medium">{detection.refined_label}</div>
                        <div className="text-gray-500">
                          BBox: [{detection.bbox.join(', ')}]
                        </div>
                        <div className="text-gray-500">
                          Confidence: {Math.round(detection.refined_confidence * 100)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Visual Preview */}
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Visual Preview {selectedDetection !== null && `- ${detectionResult.refined_detections[selectedDetection].refined_label}`}
                  </h5>
                  <div className="relative bg-gray-100 rounded border">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Detection preview"
                      className="w-full h-48 object-contain rounded"
                      onLoad={(e) => {
                        // Store image dimensions for scaling
                        const img = e.currentTarget;
                        img.dataset.naturalWidth = img.naturalWidth.toString();
                        img.dataset.naturalHeight = img.naturalHeight.toString();
                      }}
                    />
                    
                    {/* Render selected bounding box or all boxes */}
                    {(selectedDetection !== null 
                      ? [detectionResult.refined_detections[selectedDetection]]
                      : detectionResult.refined_detections
                    ).map((detection, index) => {
                      const [x1, y1, x2, y2] = detection.bbox;
                      const actualIndex = selectedDetection !== null ? selectedDetection : index;
                      
                      return (
                        <div
                          key={actualIndex}
                          className={`absolute border-2 ${
                            selectedDetection !== null 
                              ? 'border-red-500 bg-red-500/20' 
                              : 'border-blue-400 bg-blue-500/20'
                          }`}
                          style={{
                            left: `${(x1 / detectionResult.width) * 100}%`,
                            top: `${(y1 / detectionResult.height) * 100}%`,
                            width: `${((x2 - x1) / detectionResult.width) * 100}%`,
                            height: `${((y2 - y1) / detectionResult.height) * 100}%`,
                          }}
                        >
                          <span className={`absolute -top-6 left-0 px-2 py-1 rounded text-xs font-medium text-white whitespace-nowrap ${
                            selectedDetection !== null ? 'bg-red-500' : 'bg-blue-500'
                          }`}>
                            {detection.refined_label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {selectedDetection !== null 
                      ? 'Showing selected detection' 
                      : `Showing all ${detectionResult.refined_detections.length} detections`}
                  </div>
                </div>
              </div>

              {/* Coordinate Details */}
              {selectedDetection !== null && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <h5 className="text-sm font-medium mb-2">Coordinate Details</h5>
                  {(() => {
                    const detection = detectionResult.refined_detections[selectedDetection];
                    const [x1, y1, x2, y2] = detection.bbox;
                    return (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <div className="font-medium text-gray-700">Bounding Box</div>
                          <div>Top-Left: ({x1}, {y1})</div>
                          <div>Bottom-Right: ({x2}, {y2})</div>
                          <div>Width: {x2 - x1}px</div>
                          <div>Height: {y2 - y1}px</div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">Relative Position</div>
                          <div>Left: {((x1 / detectionResult.width) * 100).toFixed(1)}%</div>
                          <div>Top: {((y1 / detectionResult.height) * 100).toFixed(1)}%</div>
                          <div>Width: {(((x2 - x1) / detectionResult.width) * 100).toFixed(1)}%</div>
                          <div>Height: {(((y2 - y1) / detectionResult.height) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestDetails;