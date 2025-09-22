# calls Perplexity to polish final recommendations

# backend/utils/llm_enhancer.py
import json
from typing import List, Dict, Any, Optional
from .perplexity_client import call_perplexity_chat

ENHANCER_SYSTEM = (
    "You are a friendly stylist assistant. Given a user's current outfit detections, occasion, and a candidate list of recommended items, "
    "produce ONLY valid JSON with a concise human-friendly 'final_description' (1-3 sentences), 'recommendation_style' (short phrase), "
    "'confidence_level' (low|medium|high), and an array 'items_explained' with short reasons for each recommended item."
)

ENHANCER_USER_TEMPLATE = """
Detections: {detections}
Occasion: {occasion}
Recommendations: {recommendations}

Return JSON only:
{{
  "final_description": string,
  "recommendation_style": string,
  "confidence_level": "low"|"medium"|"high",
  "items_explained": [{{"label": string, "reason": string}}]
}}
"""

def enhance_recommendation(detections: Dict[str, Any], occasion: str, recommendations: List[Dict[str,Any]]) -> Dict[str,Any]:
    user_prompt = ENHANCER_USER_TEMPLATE.format(
        detections=json.dumps(detections),
        occasion=occasion or "",
        recommendations=json.dumps(recommendations)
    )
    messages = [
        {"role": "system", "content": ENHANCER_SYSTEM},
        {"role": "user", "content": user_prompt}
    ]
    _, content = call_perplexity_chat(messages)
    try:
        parsed = json.loads(content)
    except Exception:
        # graceful fallback: wrap plain text into JSON
        parsed = {
            "final_description": content.strip(),
            "recommendation_style": "",
            "confidence_level": "medium",
            "items_explained": []
        }
    return parsed
