import React from 'react';
import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

const RecommendationsPage: React.FC = () => {
    return (
        <div className="prose prose-gray max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Recommendations</h1>
            <p className="text-xl text-gray-600 mb-8">
                Hybrid recommendation generation and final user-facing enhancement output.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Overview</h2>
            <p>
                Outfit Guru recommendations combine multiple strategies: rule-based matching, optional ML scoring,
                and LLM enhancement for human-readable reasoning.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">How Recommendations Are Built</h2>
            <div className="not-prose mb-6">
                <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">1. Hybrid Candidate Generation</h3>
                        <p className="text-sm text-gray-600">
                            <code>generate_hybrid_recommendations</code> combines known rules + model-informed signals + optional LLM additions.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">2. Duplicate and Exclusion Control</h3>
                        <p className="text-sm text-gray-600">
                            Backend filters duplicates and applies <code>exclude_previous</code> to avoid repeated suggestions.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">3. LLM Enhancement Layer</h3>
                        <p className="text-sm text-gray-600">
                            <code>llm_enhancer.py</code> turns item suggestions into a concise summary with confidence and item reasons.
                        </p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">4. Output Normalization</h3>
                        <p className="text-sm text-gray-600">
                            Response parser sanitizes malformed model text so recommendation cards remain stable in UI.
                        </p>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Endpoint Contract</h2>
            <div className="not-prose mb-6">
                <CodeBlock language="json" filename="recommend-request.json">
                    {`{
  "detections": {
    "detection_0": {
      "label": "shirt",
      "confidence": 0.91,
      "bbox": [120, 90, 420, 410],
      "dominant_color_hex": "#3f4a5a",
      "source_model": "yolov8n"
    },
    "analysis": {
      "outfit_description": "Clean neutral outfit",
      "llm_suggested_additions": ["watch"]
    }
  },
  "person_regions": [],
  "occasion": "party",
  "exclude_previous": ["watch"]
}`}
                </CodeBlock>
            </div>

            <div className="not-prose mb-6">
                <CodeBlock language="json" filename="recommend-response.json">
                    {`{
  "hybrid_recommendations": [
    { "label": "statement sneakers", "source": "ml+rule" },
    { "label": "minimal chain", "source": "llm" }
  ],
  "enhanced": {
    "final_description": "Add a subtle statement sneaker and one metallic accent to elevate the look for party settings.",
    "recommendation_style": "party smart-casual",
    "confidence_level": "high",
    "items_explained": [
      {
        "label": "statement sneakers",
        "reason": "They introduce controlled contrast without breaking overall color harmony."
      },
      {
        "label": "minimal chain",
        "reason": "Adds visual focus near the neckline and supports party styling cues."
      }
    ]
  }
}`}
                </CodeBlock>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">UI Rendering Notes</h2>
            <ul>
                <li>Both V1 and V2 pass through the same analyzer and recommendation rendering component.</li>
                <li>Recommendation items are grouped by source label: <code>llm</code>, <code>ml+rule</code>, <code>rule</code>.</li>
                <li>
                    Final enhancement text is sanitized before display to avoid markdown JSON fragments leaking into the card.
                </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Tuning Strategies</h2>
            <div className="not-prose mb-6">
                <CodeBlock language="text" filename="recommendation-tuning.txt">
                    {`Recommended tuning order:
1) Improve base detection quality (bad detections create noisy recommendations).
2) Tighten hybrid rule logic and exclusions.
3) Adjust LLM prompt specificity for concise, structured enhancement output.
4) Validate confidence_level mapping consistency (low/medium/high only).
5) Monitor repeated items and add stronger dedupe heuristics if needed.`}
                </CodeBlock>
            </div>

            <div className="not-prose mb-8">
                <Callout type="tip" title="Production Reliability">
                    <p>
                        Keep recommendation payloads schema-first and bounded in size. Short, typed outputs are easier to render,
                        test, and monitor than free-form model prose.
                    </p>
                </Callout>
            </div>
        </div>
    );
};

export default RecommendationsPage;
