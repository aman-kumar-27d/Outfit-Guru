import json
import re
from typing import Any, Dict, List, Optional, Tuple


def _strip_markdown_fences(text: str) -> str:
    if not isinstance(text, str):
        return ""

    cleaned = text.replace("\ufeff", "").strip()

    fenced = re.search(r"`{2,3}\s*(?:json)?\s*([\s\S]*?)\s*`{2,3}", cleaned, flags=re.IGNORECASE)
    if fenced:
        cleaned = fenced.group(1).strip()

    cleaned = re.sub(r"^\s*`{2,3}\s*(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*`{2,3}\s*$", "", cleaned)
    return cleaned.strip()


def _extract_first_json_object(text: str) -> Optional[str]:
    if not text:
        return None

    start = None
    depth = 0
    in_string = False
    escaped = False

    for idx, ch in enumerate(text):
        if escaped:
            escaped = False
            continue

        if ch == "\\":
            escaped = True
            continue

        if ch == '"':
            in_string = not in_string
            continue

        if in_string:
            continue

        if ch == "{":
            if depth == 0:
                start = idx
            depth += 1
        elif ch == "}":
            if depth > 0:
                depth -= 1
                if depth == 0 and start is not None:
                    return text[start : idx + 1]

    return None


def _parse_candidate_json(value: str) -> Optional[Dict[str, Any]]:
    if not value:
        return None

    try:
        parsed = json.loads(value)
        if isinstance(parsed, dict):
            return parsed
        if isinstance(parsed, str):
            nested = _strip_markdown_fences(parsed)
            nested_obj = _extract_first_json_object(nested) or nested
            try:
                nested_parsed = json.loads(nested_obj)
                if isinstance(nested_parsed, dict):
                    return nested_parsed
            except Exception:
                return None
    except Exception:
        return None

    return None


def parse_llm_json_dict(raw_content: Any) -> Tuple[Optional[Dict[str, Any]], str]:
    text = str(raw_content or "").strip()
    if not text:
        return None, "empty"

    direct = _parse_candidate_json(text)
    if direct is not None:
        return direct, "direct-json"

    cleaned = _strip_markdown_fences(text)
    cleaned_parsed = _parse_candidate_json(cleaned)
    if cleaned_parsed is not None:
        return cleaned_parsed, "fenced-json"

    extracted = _extract_first_json_object(cleaned) or _extract_first_json_object(text)
    extracted_parsed = _parse_candidate_json(extracted or "")
    if extracted_parsed is not None:
        return extracted_parsed, "extracted-json"

    unescaped = cleaned.replace('\\"', '"').replace("\\n", "\n").replace("\\t", "\t")
    unescaped_parsed = _parse_candidate_json(unescaped)
    if unescaped_parsed is not None:
        return unescaped_parsed, "unescaped-json"

    return None, "fallback-text"


def _sanitize_text(value: Any, max_len: int = 500) -> str:
    if value is None:
        return ""
    text = _strip_markdown_fences(str(value))
    text = re.sub(r"\s+", " ", text).strip()
    return text[:max_len]


def _sanitize_list(value: Any, item_limit: int = 10, item_max_len: int = 120) -> List[str]:
    if not isinstance(value, list):
        return []

    out: List[str] = []
    for item in value:
        cleaned = _sanitize_text(item, max_len=item_max_len)
        if cleaned:
            out.append(cleaned)
        if len(out) >= item_limit:
            break

    return out


def _extract_json_string_field(text: str, field_name: str) -> str:
    if not text:
        return ""

    # Handles both valid JSON and partially broken JSON fragments.
    pattern = rf'"{re.escape(field_name)}"\s*:\s*"((?:\\.|[^"\\])*)"'
    match = re.search(pattern, text, flags=re.IGNORECASE)
    if not match:
        return ""

    raw_value = match.group(1)
    unescaped = bytes(raw_value, "utf-8").decode("unicode_escape")
    return _sanitize_text(unescaped, max_len=700)


def normalize_analysis_payload(parsed: Optional[Dict[str, Any]], fallback_text: str = "") -> Dict[str, Any]:
    source = parsed or {}
    description = _sanitize_text(source.get("outfit_description", ""), max_len=700)

    if not description:
        extracted = _extract_json_string_field(fallback_text, "outfit_description")
        description = extracted or _sanitize_text(fallback_text, max_len=700)

    if description.lstrip().startswith("{"):
        extracted = _extract_json_string_field(description, "outfit_description")
        if extracted:
            description = extracted

    if not description:
        description = "Outfit analysis completed."

    return {
        "outfit_description": description,
        "positives": _sanitize_list(source.get("positives", [])),
        "negatives": _sanitize_list(source.get("negatives", [])),
        "lacking_items": _sanitize_list(source.get("lacking_items", [])),
        "llm_suggested_additions": _sanitize_list(source.get("llm_suggested_additions", [])),
        "llm_tags": _sanitize_list(source.get("llm_tags", []), item_limit=12, item_max_len=50),
    }


def normalize_enhancement_payload(parsed: Optional[Dict[str, Any]], fallback_text: str = "") -> Dict[str, Any]:
    source = parsed or {}
    final_description = _sanitize_text(source.get("final_description", ""), max_len=900)

    if not final_description:
        final_description = _sanitize_text(fallback_text, max_len=900)

    if not final_description:
        final_description = "Enhancement recommendations processed successfully."

    confidence = _sanitize_text(source.get("confidence_level", "medium"), max_len=16).lower()
    if confidence not in {"low", "medium", "high"}:
        confidence = "medium"

    items_explained_raw = source.get("items_explained", [])
    items_explained: List[Dict[str, str]] = []
    if isinstance(items_explained_raw, list):
        for entry in items_explained_raw[:10]:
            if not isinstance(entry, dict):
                continue
            label = _sanitize_text(entry.get("label", ""), max_len=80)
            reason = _sanitize_text(entry.get("reason", ""), max_len=260)
            if label or reason:
                items_explained.append({"label": label or "item", "reason": reason})

    return {
        "final_description": final_description,
        "recommendation_style": _sanitize_text(source.get("recommendation_style", "personalized style"), max_len=80) or "personalized style",
        "confidence_level": confidence,
        "items_explained": items_explained,
    }
