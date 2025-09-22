# thin Perplexity API wrapper

# backend/utils/perplexity_client.py
import os
import requests
from typing import List, Dict, Any, Tuple

from dotenv import load_dotenv
load_dotenv()

API_URL = os.getenv("API_URL")  # Perplexity chat endpoint (OpenAI-like)
DEFAULT_MODEL = os.getenv("DEFAULT_MODEL")  # recommended model in docs

def call_perplexity_chat(messages: List[Dict[str, str]], model: str = DEFAULT_MODEL, timeout: int = 30) -> Tuple[Dict[str, Any], str]:
    """
    Call Perplexity Chat Completions endpoint.
    messages: list of {"role":"system"|"user"|"assistant", "content": "..."}
    returns: (raw_json_response, content_string)
    """
    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key:
        raise RuntimeError("PERPLEXITY_API_KEY not set in environment")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    payload = {
        "model": model,
        "messages": messages,
        # you can tune max_tokens / temperature etc here
        "temperature": 0.2,
        "max_tokens": 512
    }

    resp = requests.post(API_URL, json=payload, headers=headers, timeout=timeout)
    resp.raise_for_status()
    data = resp.json()
    # Perplexity returns choices similar to OpenAI: choices[0].message.content
    try:
        content = data["choices"][0]["message"]["content"]
    except Exception:
        # fallback: some responses are in `result` or `text`
        content = data.get("text", "") or str(data)
    return data, content
