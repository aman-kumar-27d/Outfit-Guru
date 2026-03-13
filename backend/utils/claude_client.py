# thin Anthropic Claude API wrapper
# mirrors call_perplexity_chat signature so the router can swap them transparently

# backend/utils/claude_client.py
import os
from typing import List, Dict, Any, Tuple

import anthropic
from dotenv import load_dotenv

load_dotenv()

CLAUDE_DEFAULT_MODEL = os.getenv("CLAUDE_MODEL", "claude-3-5-haiku-20241022")


def call_claude_chat(
    messages: List[Dict[str, str]],
    model: str = CLAUDE_DEFAULT_MODEL,
    timeout: int = 30,
) -> Tuple[Dict[str, Any], str]:
    """
    Call Anthropic Claude Messages API.

    messages: list of {"role": "system"|"user"|"assistant", "content": "..."}
              (same format as Perplexity / OpenAI — system role is extracted automatically)
    returns:  (raw_response_dict, content_string)
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not set in environment")

    # Anthropic SDK requires the system prompt to be passed separately;
    # extract any leading system message and keep only user/assistant turns.
    system_prompt = ""
    conversation: List[Dict[str, str]] = []
    for msg in messages:
        if msg["role"] == "system":
            # concatenate in case there are multiple system messages
            system_prompt = (system_prompt + "\n" + msg["content"]).strip()
        else:
            conversation.append({"role": msg["role"], "content": msg["content"]})

    client = anthropic.Anthropic(api_key=api_key)

    kwargs: Dict[str, Any] = {
        "model": model,
        "max_tokens": 512,
        "messages": conversation,
        "temperature": 0.2,
    }
    if system_prompt:
        kwargs["system"] = system_prompt

    response = client.messages.create(**kwargs)

    # Build a dict that mirrors the structure callers may inspect
    raw: Dict[str, Any] = response.model_dump() if hasattr(response, "model_dump") else {}

    # Extract plain-text content from the first content block
    try:
        content = response.content[0].text
    except Exception:
        content = str(response)

    return raw, content
