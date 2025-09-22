import React, { useState } from "react";
import { Upload, Image as ImageIcon, Palette, Loader2 } from "lucide-react";

type Detection = {
  label: string;
  confidence: number;
  bbox: [number, number, number, number];
  dominant_color_hex: string;
  source_model: string;
};

type PersonRegion = {
  person_bbox: [number, number, number, number];
  regions: {
    top: { bbox: [number, number, number, number]; dominant_color_hex: string };
    bottom: { bbox: [number, number, number, number]; dominant_color_hex: string };
    shoes: { bbox: [number, number, number, number]; dominant_color_hex: string };
  };
};


export default function OutfitDetector() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);
  const [personRegions, setPersonRegions] = useState<PersonRegion[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
      setDetections([]); // reset
    }
  };

  const handleUpload = async () => {
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await fetch("http://localhost:8000/detect", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setDetections(data.detections || []);
      setPersonRegions(data.person_regions || []);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">AI Outfit Detection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your outfit photo and let our AI identify clothing items with precision
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Side: Upload + Image */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Upload Outfit</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Image File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                />
              </div>
              
              <button
                onClick={handleUpload}
                disabled={loading || !image}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Analyzing..." : "Detect Outfit Items"}
              </button>
            </div>

            {preview && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Preview & Detection Results</h4>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={preview}
                    alt="Outfit preview"
                    className="w-full h-auto max-h-96 object-contain rounded-lg"
                  />
                  {/* Bounding Boxes */}
                  {detections.map((det, i) => {
                    const [x1, y1, x2, y2] = det.bbox;
                    return (
                      <div
                        key={i}
                        className="absolute border-2 border-blue-400 bg-blue-500/20"
                        style={{
                          left: `${x1+90}px`,
                          top: `${y1}px`,
                          width: `${(x2 - x1)+10}px`,
                          height: `${y2 - y1}px`,
                        }}
                      >
                        <span className="absolute -top-6 -left-8 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                          {det.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Detected Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Detected Items</h3>
            </div>
            
            <div className="h-[500px] overflow-y-auto pr-2">
              {detections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">No detections yet</p>
                  <p className="text-sm text-gray-400">Upload an image to see detected clothing items</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detections.map((det, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-gray-900 capitalize">{det.label}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {Math.round(det.confidence * 100)}% confident
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Source Model: <span className="font-medium">{det.source_model}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-sm flex items-center justify-center"
                          style={{ backgroundColor: det.dominant_color_hex }}
                          title={`Dominant color: ${det.dominant_color_hex}`}
                        >
                          <Palette className="w-3 h-3 text-white drop-shadow-sm" />
                        </div>
                        <span className="text-xs text-gray-400 font-mono">
                          {det.dominant_color_hex}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {personRegions.map((person, i) => (
              <div key={i} className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Person {i + 1} Regions</h3>
                <div className="flex gap-3">
                  {Object.entries(person.regions).map(([part, info]) => (
                    <div key={part} className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full border shadow"
                        style={{ backgroundColor: info.dominant_color_hex }}
                        title={part}
                      />
                      <p className="text-xs capitalize">{part}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
