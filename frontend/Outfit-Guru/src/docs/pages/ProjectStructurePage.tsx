import React from 'react';
import CodeBlock from '../components/CodeBlock';
import Callout from '../components/Callout';

const ProjectStructurePage: React.FC = () => {
    return (
        <div className="prose prose-gray max-w-none">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Project Structure</h1>
            <p className="text-xl text-gray-600 mb-8">
                Codebase layout, ownership boundaries, and data flow between frontend and backend.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Top-Level Layout</h2>
            <p>
                Outfit Guru is organized as a monorepo-style project. The backend serves inference and recommendation APIs,
                while the frontend provides two detection experiences that feed a shared analyzer UI.
            </p>

            <div className="not-prose mb-6">
                <CodeBlock language="text" filename="repository-tree.txt">
                    {`FR-1/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── scripts/
│   └── utils/
│       ├── detect.py
│       ├── D2.py
│       ├── face_blur.py
│       ├── llm_router.py
│       ├── llm_analyzer.py
│       ├── llm_enhancer.py
│       ├── llm_response_parser.py
│       └── recommend_hybrid.py
├── frontend/
│   └── Outfit-Guru/
│       ├── src/components/
│       │   ├── OutfitDetector.tsx
│       │   ├── OutfitAnalyzer.tsx
│       │   └── V2/OutfitDetectorV2.tsx
│       ├── src/docs/
│       └── src/lib/utils.ts
├── weights/
├── data/
├── blurred_uploads/
└── notebooks/`}
                </CodeBlock>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Backend Responsibilities</h2>
            <ul>
                <li>
                    <strong>API Entrypoint:</strong> <code>backend/main.py</code> contains health and core inference routes.
                </li>
                <li>
                    <strong>Detection:</strong> <code>backend/utils/detect.py</code> (v1) and <code>backend/utils/D2.py</code> (v2).
                </li>
                <li>
                    <strong>Privacy:</strong> <code>backend/utils/face_blur.py</code> blurs faces before detection.
                </li>
                <li>
                    <strong>LLM Analysis:</strong> <code>backend/utils/llm_analyzer.py</code> generates structured outfit insights.
                </li>
                <li>
                    <strong>Hybrid Recommendation:</strong> <code>backend/utils/recommend_hybrid.py</code> merges rule/ML/LLM signals.
                </li>
                <li>
                    <strong>Enhancement:</strong> <code>backend/utils/llm_enhancer.py</code> produces user-facing explanation text.
                </li>
                <li>
                    <strong>Response Hardening:</strong> <code>backend/utils/llm_response_parser.py</code> normalizes malformed model outputs.
                </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Frontend Responsibilities</h2>
            <ul>
                <li>
                    <strong>V1 Detection Flow:</strong> <code>src/components/OutfitDetector.tsx</code> uses <code>/detect</code>.
                </li>
                <li>
                    <strong>V2 Detection Flow:</strong> <code>src/components/V2/OutfitDetectorV2.tsx</code> uses <code>/detect-v2</code> and converts response format.
                </li>
                <li>
                    <strong>Shared Analysis UI:</strong> <code>src/components/OutfitAnalyzer.tsx</code> renders analysis and recommendations for both versions.
                </li>
                <li>
                    <strong>Client-Side Normalization:</strong> <code>src/lib/utils.ts</code> sanitizes analysis/enhancement payloads before rendering.
                </li>
                <li>
                    <strong>Documentation:</strong> <code>src/docs/</code> contains documentation router, nav, components, and pages.
                </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Runtime Request Flow</h2>
            <div className="not-prose mb-6">
                <CodeBlock language="text" filename="request-flow.txt">
                    {`1) User uploads image
   Frontend -> POST /detect or /detect-v2

2) Backend inference pipeline
   read bytes -> blur_faces -> YOLO detect -> return detections + person_regions

3) User clicks Analyze
   Frontend -> POST /analyze
   Backend -> llm_analyzer -> llm_response_parser -> normalized analysis JSON

4) User clicks Enhance My Outfit
   Frontend -> POST /recommend
   Backend -> recommend_hybrid + llm_enhancer -> llm_response_parser -> normalized enhancement JSON

5) Shared analyzer UI displays data
   Frontend normalizeAnalysisPayload / normalizeEnhancementPayload as defensive render layer`}
                </CodeBlock>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Current Core Endpoints</h2>
            <div className="not-prose mb-6 overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Method</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Path</th>
                            <th className="px-4 py-3 text-left font-semibold text-gray-900">Purpose</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm">POST</td>
                            <td className="px-4 py-3 text-sm font-mono">/detect</td>
                            <td className="px-4 py-3 text-sm">Detection pipeline v1</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm">POST</td>
                            <td className="px-4 py-3 text-sm font-mono">/detect-v2</td>
                            <td className="px-4 py-3 text-sm">Detection pipeline v2</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm">POST</td>
                            <td className="px-4 py-3 text-sm font-mono">/analyze</td>
                            <td className="px-4 py-3 text-sm">LLM outfit analysis</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm">POST</td>
                            <td className="px-4 py-3 text-sm font-mono">/recommend</td>
                            <td className="px-4 py-3 text-sm">Hybrid + LLM recommendations</td>
                        </tr>
                        <tr className="border-t border-gray-200">
                            <td className="px-4 py-3 text-sm">GET</td>
                            <td className="px-4 py-3 text-sm font-mono">/health</td>
                            <td className="px-4 py-3 text-sm">Service health check</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="not-prose mb-8">
                <Callout type="info" title="Maintenance Guidance">
                    <p>
                        Keep parsing and schema normalization in backend first, and keep frontend normalization as a safety net.
                        This prevents model formatting noise from leaking into the user interface.
                    </p>
                </Callout>
            </div>
        </div>
    );
};

export default ProjectStructurePage;
