# calls Perplexity to polish final recommendations

# backend/utils/llm_enhancer.py
import json
import logging
from typing import List, Dict, Any, Optional
from .llm_router import call_chat
from .llm_response_parser import parse_llm_json_dict, normalize_enhancement_payload


logger = logging.getLogger(__name__)

ENHANCER_SYSTEM = (
    "You are a friendly stylist assistant. Given a user's current outfit detections, occasion, and a candidate list of recommended items, "
    "produce ONLY valid JSON with a concise human-friendly 'final_description' (1-3 sentences), 'recommendation_style' (short phrase), "
    "'confidence_level' (low|medium|high), and an array 'items_explained' with short reasons for each recommended item. "
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
    _, content = call_chat(messages)
    parsed, parse_path = parse_llm_json_dict(content)
    logger.info("llm_enhancer parse_path=%s", parse_path)
    return normalize_enhancement_payload(parsed, fallback_text=content)
