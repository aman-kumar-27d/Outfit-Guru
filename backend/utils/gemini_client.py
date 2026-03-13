# thin Gemini API wrapper
# mirrors call_perplexity_chat signature so the router can swap providers transparently

# backend/utils/gemini_client.py
import os
from typing import List, Dict, Any, Tuple

import requests
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_BASE_URL = os.getenv(
    "GEMINI_API_BASE_URL",
    "https://generativelanguage.googleapis.com/v1beta",
)
GEMINI_DEFAULT_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")


def call_gemini_chat(
    messages: List[Dict[str, str]],
    model: str = GEMINI_DEFAULT_MODEL,
    timeout: int = 30,
) -> Tuple[Dict[str, Any], str]:
    """
    Call Gemini generateContent endpoint.

    messages: list of {"role": "system"|"user"|"assistant", "content": "..."}
    returns: (raw_json_response, content_string)
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set in environment")

    system_prompt = ""
    contents = []
    for msg in messages:
        role = msg.get("role")
        content = msg.get("content", "")

        if role == "system":
            system_prompt = (system_prompt + "\n" + content).strip()
            continue

        if role == "assistant":
            gemini_role = "model"
        else:
            gemini_role = "user"

        contents.append({
            "role": gemini_role,
            "parts": [{"text": content}],
        })

    if not contents:
        contents = [{"role": "user", "parts": [{"text": ""}]}]

    payload: Dict[str, Any] = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 512,
        },
    }
    if system_prompt:
        payload["system_instruction"] = {
            "parts": [{"text": system_prompt}]
        }

    url = f"{GEMINI_API_BASE_URL.rstrip('/')}/models/{model}:generateContent?key={api_key}"
    response = requests.post(url, json=payload, timeout=timeout)
    response.raise_for_status()
    data = response.json()

    try:
        parts = data["candidates"][0]["content"]["parts"]
        content = "\n".join(part.get("text", "") for part in parts).strip()
    except Exception:
        content = data.get("text", "") or str(data)

    return data, content