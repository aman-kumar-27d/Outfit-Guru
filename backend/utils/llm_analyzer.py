# calls Perplexity to analyze current outfit

# backend/utils/llm_analyzer.py
import json
import logging
from typing import Dict, Any, Optional
from .llm_router import call_chat
from .llm_response_parser import parse_llm_json_dict, normalize_analysis_payload


logger = logging.getLogger(__name__)

ANALYZER_SYSTEM = (
    "You are a concise, objective fashion analyst. "
    "Given machine-generated detection data about a person's outfit and optional occasion, "
    "produce ONLY valid JSON (no extra text) following the schema exactly. "
    "If data is missing, return sensible defaults (empty lists)."
)

ANALYZER_USER_TEMPLATE = """
Input JSON: {input_json}

Task:
1) Describe the outfit in one short sentence in 'outfit_description'.
2) List positives in 'positives' (array of short strings).
3) List negatives (what looks off) in 'negatives'.
4) List 'lacking_items' (short item names user could add).
5) List 'llm_suggested_additions' (short item labels e.g. 'denim jacket', 'brown loafers').
6) Add 'llm_tags' (array of tags like 'casual','formal','party').
Output schema (JSON ONLY):
{{
  "outfit_description": string,
  "positives": [string],
  "negatives": [string],
  "lacking_items": [string],
  "llm_suggested_additions": [string],
  "llm_tags": [string]
}}
"""

def analyze_outfit(detections: Dict[str, Any], person_regions: Optional[list] = None, occasion: Optional[str] = "casual") -> Dict[str, Any]:
    """
    detections: the JSON returned by detect_image_bytes (detections + person_regions).
    occasion: optional user-selected occasion (can be casual).
    Returns parsed JSON per schema above.
    """
    payload = {
        "detections": detections or [],
        "person_regions": person_regions or [],
        "occasion": occasion or ""
    }
    user_msg = ANALYZER_USER_TEMPLATE.format(input_json=json.dumps(payload))
    messages = [
        {"role": "system", "content": ANALYZER_SYSTEM},
        {"role": "user", "content": user_msg}
    ]

    raw, content = call_chat(messages)
    parsed, parse_path = parse_llm_json_dict(content)
    logger.info("llm_analyzer parse_path=%s raw_keys=%s", parse_path, list(raw.keys())[:5] if isinstance(raw, dict) else [])
    return normalize_analysis_payload(parsed, fallback_text=content)
