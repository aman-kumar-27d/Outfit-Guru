import React from 'react';
import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

const StyleAnalysisPage: React.FC = () => {
    return (
        <div className="prose prose-gray max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Style Analysis</h1>
            <p className="text-xl text-gray-600 mb-8">
                How Outfit Guru converts raw detections into structured fashion feedback.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">What Style Analysis Produces</h2>
            <p>
                The analysis stage transforms detected items, color metadata, and occasion context into a compact JSON payload
                that the UI can render consistently.
            </p>

            <div className="not-prose mb-6">
                <CodeBlock language="json" filename="analysis-response.json">
                    {`{
  "analysis": {
    "outfit_description": "A balanced casual look with neutral tones and clean layering.",
    "positives": [
      "Top and bottom colors are cohesive",
      "Overall silhouette fits the selected occasion"
    ],
    "negatives": [
      "Footwear style is slightly less formal than the rest of the outfit"
    ],
    "lacking_items": ["watch", "lightweight outer layer"],
    "llm_suggested_additions": ["minimal watch", "white sneakers"],
    "llm_tags": ["casual", "balanced", "neutral"]
  }
}`}
                </CodeBlock>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Pipeline</h2>
            <div className="not-prose mb-6">
                <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">1. Input Assembly</h3>
                        <p className="text-sm text-gray-600">
                            Frontend sends detections, person regions, and selected occasion to <code>/analyze</code>.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">2. LLM Prompting</h3>
                        <p className="text-sm text-gray-600">
                            Backend uses strict JSON-only prompting in <code>llm_analyzer.py</code>.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">3. Parse + Normalize</h3>
                        <p className="text-sm text-gray-600">
                            <code>llm_response_parser.py</code> strips code fences, extracts JSON, and applies safe defaults.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">4. Defensive UI Render</h3>
                        <p className="text-sm text-gray-600">
                            Frontend runs <code>normalizeAnalysisPayload</code> before display, so malformed model text does not break UI.
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Request Contract</h2>
            <div className="not-prose mb-6">
                <CodeBlock language="json" filename="analyze-request.json">
                    {`{
  "detections": {
    "detection_0": {
      "label": "shirt",
      "confidence": 0.91,
      "bbox": [120, 90, 420, 410],
      "dominant_color_hex": "#3f4a5a",
      "source_model": "yolov8n"
    }
  },
  "person_regions": [
    {
      "person_bbox": [80, 40, 500, 760],
      "regions": {
        "top": { "bbox": [120, 90, 420, 300], "dominant_color_hex": "#3f4a5a" },
        "bottom": { "bbox": [120, 300, 420, 560], "dominant_color_hex": "#2f2f2f" },
        "shoes": { "bbox": [120, 560, 420, 740], "dominant_color_hex": "#ffffff" }
      }
    }
  ],
  "occasion": "casual"
}`}
                </CodeBlock>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Common Analysis Signals</h2>
            <ul>
                <li>
                    <strong>Color harmony:</strong> contrast, complementary pairing, and palette balance.
                </li>
                <li>
                    <strong>Occasion suitability:</strong> matching outfit elements against selected context (casual, party, college, ceremony).
                </li>
                <li>
                    <strong>Completeness:</strong> missing accessories or layers that would improve cohesion.
                </li>
                <li>
                    <strong>Consistency:</strong> whether footwear, top, and bottom communicate the same style intent.
                </li>
            </ul>

            <div className="not-prose mb-8">
                <Callout type="warning" title="Model Output Safety">
                    <p>
                        LLM output can occasionally include markdown fences or partial JSON. The backend parser and frontend normalizer
                        are intentionally layered to prevent broken snippets from appearing in the analysis card.
                    </p>
                </Callout>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Troubleshooting</h2>
            <div className="not-prose mb-6">
                <CodeBlock language="text" filename="analysis-debug-checklist.txt">
                    {`If analysis text looks malformed:
1) Check backend logs for parse_path from llm_analyzer.
2) Verify /analyze response keys are present and arrays are arrays.
3) Confirm frontend normalizeAnalysisPayload receives object/string as expected.
4) Re-run request with same payload to compare deterministic behavior.
5) Ensure backend is running with latest parser updates.`}
                </CodeBlock>
            </div>
        </div>
    );
};

export default StyleAnalysisPage;
