# LLM provider router
# Temporary hardening mode: force Gemini and disable provider fallback.

# backend/utils/llm_router.py
import os
import logging
from typing import List, Dict, Any, Tuple

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_SUPPORTED = ("perplexity", "claude", "gemini")
_API_KEYS = {
    "perplexity": "PERPLEXITY_API_KEY",
    "claude": "ANTHROPIC_API_KEY",
    "gemini": "GEMINI_API_KEY",
}


def _primary_provider() -> str:
    provider = os.getenv("LLM_PROVIDER", "gemini").strip().lower()
    if provider not in _SUPPORTED:
        logger.warning(
            "LLM_PROVIDER='%s' is unknown. Falling back to 'gemini'. "
            "Supported values: %s",
            provider,
            _SUPPORTED,
        )
        return "gemini"
    return provider


def _provider_chain(primary: str) -> List[str]:
    return [primary, *[provider for provider in _SUPPORTED if provider != primary]]


def _call_provider(
    provider: str,
    messages: List[Dict[str, str]],
    model: str | None,
    timeout: int,
) -> Tuple[Dict[str, Any], str]:
    if provider == "perplexity":
        from .perplexity_client import call_perplexity_chat, DEFAULT_MODEL as PPLX_DEFAULT

        return call_perplexity_chat(
            messages,
            model=model or PPLX_DEFAULT,
            timeout=timeout,
        )

    if provider == "claude":
        from .claude_client import call_claude_chat, CLAUDE_DEFAULT_MODEL

        return call_claude_chat(
            messages,
            model=model or CLAUDE_DEFAULT_MODEL,
            timeout=timeout,
        )

    if provider == "gemini":
        from .gemini_client import call_gemini_chat, GEMINI_DEFAULT_MODEL

        return call_gemini_chat(
            messages,
            model=model or GEMINI_DEFAULT_MODEL,
            timeout=timeout,
        )

    raise ValueError(f"Unknown LLM provider: {provider!r}")


def call_chat(
    messages: List[Dict[str, str]],
    model: str | None = None,
    timeout: int = 30,
) -> Tuple[Dict[str, Any], str]:
    """
    Unified LLM call with temporary strict mode: routes only to Gemini and
    does not attempt cross-provider fallback.

    messages: list of {"role": "system"|"user"|"assistant", "content": "..."}
    returns:  (raw_response_dict, content_string)
    """
    primary = _primary_provider()
    provider = "gemini"

    if primary != "gemini":
        logger.warning(
            "Temporary hardening active: overriding LLM_PROVIDER='%s' to 'gemini'.",
            primary,
        )

    api_key_var = _API_KEYS[provider]
    if not os.getenv(api_key_var):
        raise RuntimeError(f"{provider}: missing required env var {api_key_var}")

    logger.debug("LLM call via strict provider: %s", provider)
    return _call_provider(provider, messages, model, timeout)
