
import { useState } from "react";
import { BarChart3, TrendingUp, Star, Palette, User, Target, MessageSquare, CheckCircle, XCircle, Package, Tag, Loader2, Sparkles, ShoppingBag } from "lucide-react";

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

type RecommendedItem = {
  label: string;
  color?: string; // Make color optional since API doesn't return it
  source: string;
};

type EnhancementResponse = {
  recommended_items: RecommendedItem[];
  final_enhancement: {
    final_description: string | {
      final_description: string;
      recommendation_style: string;
      confidence_level: string;
      items_explained?: Array<{
        label: string;
        reason: string;
      }>;
    };
    recommendation_style: string;
    confidence_level: string;
    items_explained?: Array<{
      label: string;
      reason: string;
    }>;
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
  const [enhancementData, setEnhancementData] = useState<EnhancementResponse | null>(null);
  const [enhancementLoading, setEnhancementLoading] = useState(false);
  const [showEnhancement, setShowEnhancement] = useState(false);

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

  // Helper function to get item icon and category based on label
  const getItemInfo = (label: string) => {
    const lowerLabel = label.toLowerCase().trim();
    
    // Define comprehensive item mappings
    const itemMappings = [
      // Outerwear
      { 
        keywords: ['jacket', 'coat', 'blazer', 'cardigan', 'hoodie', 'sweater', 'pullover', 'vest', 'windbreaker', 'parka'],
        icon: '🧥',
        category: 'Outerwear'
      },
      // Footwear
      { 
        keywords: ['sneakers', 'shoes', 'boots', 'sandals', 'heels', 'flats', 'loafers', 'trainers', 'pumps', 'slippers'],
        icon: '👟',
        category: 'Footwear'
      },
      // Accessories - Timepieces
      { 
        keywords: ['watch', 'smartwatch', 'timepiece', 'wristwatch'],
        icon: '⌚',
        category: 'Accessory'
      },
      // Bags
      { 
        keywords: ['bag', 'backpack', 'purse', 'handbag', 'tote', 'clutch', 'satchel', 'briefcase', 'messenger'],
        icon: '🎒',
        category: 'Bag'
      },
      // Headwear
      { 
        keywords: ['hat', 'cap', 'beanie', 'beret', 'fedora', 'baseball cap', 'bucket hat', 'snapback'],
        icon: '🧢',
        category: 'Headwear'
      },
      // Jewelry
      { 
        keywords: ['necklace', 'jewelry', 'bracelet', 'ring', 'earrings', 'chain', 'pendant', 'jewellery'],
        icon: '💍',
        category: 'Jewelry'
      },
      // Eyewear
      { 
        keywords: ['glasses', 'sunglasses', 'eyewear', 'specs', 'shades'],
        icon: '🕶️',
        category: 'Eyewear'
      },
      // Belts & Straps
      { 
        keywords: ['belt', 'strap', 'waistband'],
        icon: '⚫',
        category: 'Accessory'
      },
      // Scarves & Wraps
      { 
        keywords: ['scarf', 'wrap', 'shawl', 'pashmina', 'bandana'],
        icon: '🧣',
        category: 'Accessory'
      },
      // Gloves
      { 
        keywords: ['gloves', 'mittens'],
        icon: '🧤',
        category: 'Accessory'
      },
      // Tops
      { 
        keywords: ['shirt', 'blouse', 'top', 't-shirt', 'tank', 'camisole', 'polo', 'tee'],
        icon: '👕',
        category: 'Top'
      },
      // Bottoms
      { 
        keywords: ['pants', 'jeans', 'trousers', 'shorts', 'skirt', 'dress', 'leggings', 'tights'],
        icon: '👖',
        category: 'Bottom'
      },
      // Socks & Hosiery
      { 
        keywords: ['socks', 'stockings', 'pantyhose', 'tights', 'hosiery'],
        icon: '🧦',
        category: 'Hosiery'
      }
    ];

    // Find matching category
    for (const mapping of itemMappings) {
      if (mapping.keywords.some(keyword => lowerLabel.includes(keyword))) {
        return { icon: mapping.icon, category: mapping.category };
      }
    }

    // Log unknown items for debugging (can be removed in production)
    console.log(`Unknown item category detected: "${label}" - using default fallback`);
    
    // Default fallback for unknown items
    return { icon: '✨', category: 'Accessory' };
  };

  // Helper function to extract enhancement data properly
  const extractEnhancementData = (enhancementData: EnhancementResponse) => {
    const finalEnhancement = enhancementData.final_enhancement;
    
    // Handle the new structure where final_enhancement might be directly the data we need
    if (typeof finalEnhancement === 'object' && finalEnhancement.final_description && typeof finalEnhancement.final_description === 'string') {
      // Check if final_description contains JSON wrapped in markdown code blocks
      const description = finalEnhancement.final_description.trim();
      
      if (description.startsWith('```json') || description.startsWith('``json') || description.startsWith('{')) {
        try {
          // Clean up markdown code blocks if present - handle various formats
          let cleanJson = description;
          
          // Remove various markdown code block formats
          cleanJson = cleanJson
            .replace(/^```json\s*/, '')      // Standard ```json
            .replace(/^``json\s*/, '')       // Malformed ``json  
            .replace(/^`+json\s*/, '')       // Any number of backticks + json
            .replace(/\s*```\s*$/, '')       // Ending ```
            .replace(/\s*``\s*$/, '')        // Ending ``
            .replace(/\s*`+\s*$/, '')        // Any trailing backticks
            .trim();                         // Remove any remaining whitespace
          
          // Additional cleanup for any remaining backticks or quotes at the end
          if (cleanJson.endsWith('"')) {
            cleanJson = cleanJson.slice(0, -1);
          }
          
          const parsed = JSON.parse(cleanJson);
          
          return {
            final_description: parsed.final_description || 'Enhancement details processed successfully.',
            recommendation_style: parsed.recommendation_style || finalEnhancement.recommendation_style || 'personalized style',
            confidence_level: parsed.confidence_level || finalEnhancement.confidence_level || 'medium',
            items_explained: parsed.items_explained || finalEnhancement.items_explained || []
          };
        } catch (error) {
          console.error('JSON parsing error:', error);
          console.log('Raw data that failed to parse:', description);
          
          // Fallback: try to extract just the description text manually
          let fallbackDescription = description;
          
          // Try to extract the final_description value manually using regex
          const descriptionMatch = fallbackDescription.match(/"final_description":\s*"([^"]+)"/);
          if (descriptionMatch && descriptionMatch[1]) {
            fallbackDescription = descriptionMatch[1];
          } else {
            // Remove JSON structure artifacts if regex fails
            fallbackDescription = fallbackDescription
              .replace(/^```json\s*/, '')
              .replace(/\s*```\s*$/, '')
              .replace(/^\{\s*/, '')
              .replace(/\s*\}\s*$/, '')
              .replace(/"final_description":\s*"/, '')
              .replace(/",.*$/, '')
              .replace(/\\"/g, '"'); // Unescape quotes
          }
          
          return {
            final_description: fallbackDescription || 'Enhancement recommendations processed successfully.',
            recommendation_style: finalEnhancement.recommendation_style || 'personalized style',
            confidence_level: finalEnhancement.confidence_level || 'medium',
            items_explained: finalEnhancement.items_explained || []
          };
        }
      } else {
        // Regular string, use as is
        return {
          final_description: finalEnhancement.final_description,
          recommendation_style: finalEnhancement.recommendation_style || 'personalized style',
          confidence_level: finalEnhancement.confidence_level || 'medium',
          items_explained: finalEnhancement.items_explained || []
        };
      }
    }
    
    // Check if final_description is a string (old format with potential JSON)
    if (typeof finalEnhancement.final_description === 'string') {
      const trimmedDescription = finalEnhancement.final_description.trim();
      
      if (trimmedDescription.startsWith('```json') || trimmedDescription.startsWith('``json') || trimmedDescription.startsWith('{')) {
        try {
          // Clean up markdown code blocks if present - handle various formats
          let cleanJson = trimmedDescription;
          
          // Remove various markdown code block formats
          cleanJson = cleanJson
            .replace(/^```json\s*/, '')      // Standard ```json
            .replace(/^``json\s*/, '')       // Malformed ``json  
            .replace(/^`+json\s*/, '')       // Any number of backticks + json
            .replace(/\s*```\s*$/, '')       // Ending ```
            .replace(/\s*``\s*$/, '')        // Ending ``
            .replace(/\s*`+\s*$/, '')        // Any trailing backticks
            .trim();
          
          // Additional cleanup for trailing quotes
          if (cleanJson.endsWith('"')) {
            cleanJson = cleanJson.slice(0, -1);
          }
          
          const parsed = JSON.parse(cleanJson);
          
          return {
            final_description: parsed.final_description || 'Enhancement details processed successfully.',
            recommendation_style: parsed.recommendation_style || finalEnhancement.recommendation_style || 'personalized style',
            confidence_level: parsed.confidence_level || finalEnhancement.confidence_level || 'medium',
            items_explained: parsed.items_explained || finalEnhancement.items_explained || []
          };
        } catch (error) {
          console.error('JSON parsing error:', error);
          console.log('Raw data:', trimmedDescription);
          
          // Manual extraction fallback
          let extractedText = trimmedDescription;
          const descMatch = extractedText.match(/"final_description":\s*"([^"]+)"/);
          
          if (descMatch && descMatch[1]) {
            extractedText = descMatch[1];
          } else {
            // Remove JSON artifacts manually
            extractedText = extractedText
              .replace(/^```json\s*/, '')
              .replace(/\s*```\s*$/, '')
              .replace(/^\{\s*/, '')
              .replace(/\s*\}\s*$/, '')
              .replace(/"final_description":\s*"/, '')
              .replace(/",.*$/, '')
              .replace(/\\"/g, '"');
          }
          
          return {
            final_description: extractedText || 'Enhancement recommendations are being processed.',
            recommendation_style: finalEnhancement.recommendation_style || 'personalized style',
            confidence_level: finalEnhancement.confidence_level || 'medium',
            items_explained: finalEnhancement.items_explained || []
          };
        }
      } else {
        // Regular string, use as is
        return {
          final_description: finalEnhancement.final_description,
          recommendation_style: finalEnhancement.recommendation_style || 'personalized style',
          confidence_level: finalEnhancement.confidence_level || 'medium',
          items_explained: finalEnhancement.items_explained || []
        };
      }
    }
    
    // Fallback for unexpected structure
    return {
      final_description: 'Enhancement recommendations processed successfully.',
      recommendation_style: 'personalized style',
      confidence_level: 'medium',
      items_explained: []
    };
  };

  const handleGetEnhancement = async () => {
    if (detections.length === 0) return;
    
    setEnhancementLoading(true);
    setShowEnhancement(true);

    try {
      const requestData = {
        detections: detections.reduce((acc, detection, index) => {
          acc[`detection_${index}`] = {
            label: detection.label,
            confidence: detection.confidence,
            bbox: detection.bbox,
            dominant_color_hex: detection.dominant_color_hex,
            source_model: detection.source_model
          };
          return acc;
        }, {} as Record<string, any>),
        person_regions: personRegions.length > 0 ? personRegions : null,
        occasion: selectedOccasion,
        exclude_previous: []
      };

      // If we have analysis data, include it in the request
      if (analysisData) {
        requestData.detections.analysis = analysisData.analysis;
      }

      const response = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const enhancementResult = await response.json();
      
      // Handle the new response format with hybrid_recommendations and enhanced
      if (enhancementResult.hybrid_recommendations && enhancementResult.enhanced) {
        setEnhancementData({
          recommended_items: enhancementResult.hybrid_recommendations,
          final_enhancement: enhancementResult.enhanced
        });
      } else {
        // Fallback for old structure
        setEnhancementData(enhancementResult);
      }
    } catch (err) {
      console.error("Enhancement failed", err);
    } finally {
      setEnhancementLoading(false);
    }
  };

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
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
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

            {/* Enhancement Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <button
                  onClick={handleGetEnhancement}
                  disabled={enhancementLoading || detections.length === 0}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 mx-auto shadow-lg hover:shadow-xl"
                >
                  {enhancementLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <Sparkles className="w-5 h-5" />
                  {enhancementLoading ? "Getting Enhancement..." : "Enhance My Outfit"}
                  <ShoppingBag className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Get AI-powered recommendations to upgrade your outfit
                </p>
              </div>
            </div>
          </div>

          {/* Enhancement Results Section */}
          {showEnhancement && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg border border-purple-200 p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900">Outfit Enhancement</h3>
                {enhancementLoading && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
              </div>

              {enhancementLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Generating enhancement recommendations...</p>
                    <p className="text-sm text-gray-500">Finding the perfect additions for your outfit</p>
                  </div>
                </div>
              ) : enhancementData ? (
                <div className="space-y-8">
                  {(() => {
                    const extractedData = extractEnhancementData(enhancementData);
                    return (
                      <>
                        {/* Final Enhancement Description */}
                        <div className="bg-white rounded-lg p-6 border border-purple-100">
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-purple-600" />
                            Enhancement Summary
                          </h4>
                          <div className="space-y-4">
                            {/* Main Description */}
                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                              <p className="text-gray-700 leading-relaxed text-base">
                                {extractedData.final_description}
                              </p>
                            </div>
                            
                            {/* Style and Confidence Tags */}
                            <div className="flex flex-wrap gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 font-medium">Style:</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 capitalize">
                                  {extractedData.recommendation_style}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500 font-medium">Confidence:</span>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                                  extractedData.confidence_level === 'high' ? 'bg-green-100 text-green-800' :
                                  extractedData.confidence_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {extractedData.confidence_level}
                                </span>
                              </div>
                            </div>

                            {/* Items Explained Section */}
                            {extractedData.items_explained && extractedData.items_explained.length > 0 && (
                              <div className="mt-6">
                                <h5 className="text-md font-semibold text-gray-900 mb-3">Why These Items?</h5>
                                <div className="space-y-3">
                                  {extractedData.items_explained.map((item: { label: string; reason: string }, index: number) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                      <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                          <span className="text-purple-600 font-semibold text-sm">{index + 1}</span>
                                        </div>
                                      </div>
                                      <div className="flex-1">
                                        <h6 className="font-semibold text-gray-900 capitalize mb-1">{item.label}</h6>
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.reason}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}

                  {/* Recommended Items */}
                  {enhancementData.recommended_items && enhancementData.recommended_items.length > 0 ? (
                    <div className="bg-white rounded-lg p-6 border border-purple-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-purple-600" />
                        Recommended Items ({enhancementData.recommended_items.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enhancementData.recommended_items.map((item, index) => {
                          const itemInfo = getItemInfo(item.label);
                          return (
                            <div key={index} className="border border-purple-200 rounded-lg p-5 hover:border-purple-300 transition-all duration-200 hover:shadow-lg bg-gradient-to-br from-white to-purple-50/30">
                              <div className="flex items-start justify-between mb-4">
                                <h5 className="font-semibold text-gray-900 capitalize text-lg leading-tight">{item.label}</h5>
                                <div className="flex items-center gap-2 ml-3">
                                  {/* Item type icon based on label */}
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center text-lg shadow-sm">
                                    {itemInfo.icon}
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500 font-medium">Category</span>
                                  <span className="text-sm font-semibold text-gray-700 capitalize bg-gray-50 px-2 py-1 rounded-full">
                                    {itemInfo.category}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">Recommendation Source</span>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium uppercase ${
                                    item.source === 'llm' ? 'bg-blue-100 text-blue-800' :
                                    item.source === 'ml+rule' ? 'bg-green-100 text-green-800' :
                                    item.source === 'rule' ? 'bg-orange-100 text-orange-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.source}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-500">Priority</span>
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    item.source === 'llm' ? 'bg-red-100 text-red-800' :
                                    item.source === 'ml+rule' ? 'bg-yellow-100 text-yellow-800' :
                                    item.source === 'rule' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {item.source === 'llm' ? 'High' :
                                     item.source === 'ml+rule' ? 'Medium' :
                                     item.source === 'rule' ? 'Standard' :
                                     'Unknown'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg p-6 border border-purple-100">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-purple-600" />
                        Recommended Items
                      </h4>
                      <div className="text-center py-8 text-gray-500">
                        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p>No specific item recommendations at this time.</p>
                        <p className="text-sm">Check the enhancement summary above for style guidance.</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p>Enhancement recommendations will appear here once processing is complete</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}