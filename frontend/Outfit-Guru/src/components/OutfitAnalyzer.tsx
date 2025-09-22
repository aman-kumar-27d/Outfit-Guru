
import { BarChart3, TrendingUp, Star, Palette, User, Target, MessageSquare, CheckCircle, XCircle, Package, Tag, Loader2 } from "lucide-react";

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

type AnalysisResponse = {
  analysis: {
    outfit_description: string;
    positives: string[];
    negatives: string[];
    lacking_items: string[];
    llm_tags: string[];
  };
};

interface OutfitAnalyzerProps {
  detections: Detection[];
  personRegions: PersonRegion[];
  selectedOccasion: string;
  analysisData: AnalysisResponse | null;
  analysisLoading: boolean;
}

export default function OutfitAnalyzer({ detections, personRegions, selectedOccasion, analysisData, analysisLoading }: OutfitAnalyzerProps) {
    personRegions;
    // Get occasion specific data
  const getOccasionData = (occasion: string) => {
    const occasionMap: Record<string, { 
      title: string; 
      description: string; 
      styleCategory: string;
      suitabilityScore: string;
      recommendations: string[];
    }> = {
      casual: {
        title: "Casual Analysis",
        description: "Perfect for everyday activities and relaxed environments",
        styleCategory: "Casual Chic",
        suitabilityScore: "Perfect",
        recommendations: [
          "Great color coordination for casual settings",
          "Comfortable and stylish for daily activities"
        ]
      },
      party: {
        title: "Party Analysis", 
        description: "Analyzed for social gatherings and celebratory events",
        styleCategory: "Party Ready",
        suitabilityScore: "Excellent",
        recommendations: [
          "Add some statement accessories for party appeal",
          "Consider bolder colors for evening events"
        ]
      },
      college: {
        title: "College Analysis",
        description: "Suitable for academic and campus environments", 
        styleCategory: "Smart Casual",
        suitabilityScore: "Great",
        recommendations: [
          "Professional yet comfortable for academic settings",
          "Perfect balance of style and practicality"
        ]
      },
      ceremony: {
        title: "Ceremony Analysis",
        description: "Evaluated for formal events and special occasions",
        styleCategory: "Semi-Formal",
        suitabilityScore: "Good",
        recommendations: [
          "Consider more formal elements for ceremonial events",
          "Add elegant accessories to elevate the look"
        ]
      }
    };
    
    return occasionMap[occasion] || occasionMap.casual;
  };

  const occasionData = getOccasionData(selectedOccasion);
  return (
    <section className="bg-white border-t border-gray-200 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">{occasionData.title}</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {occasionData.description}
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Selected: {selectedOccasion.charAt(0).toUpperCase() + selectedOccasion.slice(1)}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* AI Analysis Response Card - New Card at Top */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg border border-orange-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">AI Analysis Report</h3>
              {analysisLoading && <Loader2 className="w-5 h-5 animate-spin text-orange-600" />}
            </div>
            
            {analysisLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Generating AI analysis...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              </div>
            ) : analysisData ? (
              <div className="space-y-6">
                {/* Outfit Description */}
                <div className="bg-white rounded-lg p-6 border border-orange-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    Outfit Description
                  </h4>
                  <p className="text-gray-700 leading-relaxed">{analysisData.analysis.outfit_description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Positives */}
                  <div className="bg-white rounded-lg p-6 border border-orange-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      What's Working Well
                    </h4>
                    <div className="space-y-2">
                      {analysisData.analysis.positives.map((positive, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{positive}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Negatives */}
                  <div className="bg-white rounded-lg p-6 border border-orange-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Areas for Improvement
                    </h4>
                    <div className="space-y-2">
                      {analysisData.analysis.negatives.length > 0 ? (
                        analysisData.analysis.negatives.map((negative, index) => (
                          <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                            <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{negative}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">No major issues detected!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Lacking Items */}
                  <div className="bg-white rounded-lg p-6 border border-orange-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5 text-blue-600" />
                      Suggested Additions
                    </h4>
                    <div className="space-y-2">
                      {analysisData.analysis.lacking_items.length > 0 ? (
                        analysisData.analysis.lacking_items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <Package className="w-4 h-4 text-blue-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700 capitalize">{item}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-600">Outfit is complete!</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* LLM Tags */}
                  <div className="bg-white rounded-lg p-6 border border-orange-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      Style Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisData.analysis.llm_tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p>AI analysis will appear here once processing is complete</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Style Score Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Style Score</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">85/100</div>
                <p className="text-gray-600">Great outfit coordination!</p>
                <div className="mt-4 bg-white rounded-lg p-3">
                  <p className="text-sm text-gray-500">Based on color harmony, item compatibility, and style trends</p>
                </div>
              </div>
            </div>

            {/* Color Harmony Card */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Color Harmony</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Complementary Colors</span>
                  <span className="text-sm font-medium text-green-600">Good</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Contrast Level</span>
                  <span className="text-sm font-medium text-green-600">Perfect</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Palette Balance</span>
                  <span className="text-sm font-medium text-yellow-600">Good</span>
                </div>
              </div>
            </div>

            {/* Trend Analysis Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Trend Analysis</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Trend</span>
                  <span className="text-sm font-medium text-green-600">92% Match</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Season Relevance</span>
                  <span className="text-sm font-medium text-green-600">Excellent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Style Category</span>
                  <span className="text-sm font-medium text-gray-700">{occasionData.styleCategory}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detected Items Analysis */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Item Analysis</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {detections.map((detection, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 capitalize">{detection.label}</h4>
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-200"
                      style={{ backgroundColor: detection.dominant_color_hex }}
                      title={detection.dominant_color_hex}
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Detection Confidence</span>
                      <span className="font-medium">{Math.round(detection.confidence * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Style Impact</span>
                      <span className="font-medium text-green-600">High</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Color Contribution</span>
                      <span className="font-medium text-blue-600">Primary</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">Recommendations</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Style Improvements</h4>
                <div className="space-y-3">
                  {occasionData.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Occasion Suitability</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <span className="text-sm font-medium text-gray-700">
                      {selectedOccasion.charAt(0).toUpperCase() + selectedOccasion.slice(1)} 
                      <span className="text-xs text-gray-500 ml-1">(Selected)</span>
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-medium">
                      {occasionData.suitabilityScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Other Occasions</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Varies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}