# LLM provider router
# Reads LLM_PROVIDER from .env and delegates to the right client.
# Supported values: "perplexity" (default), "claude"
# Auto-falls back to the other provider when the primary call fails.

# backend/utils/llm_router.py
import os
import logging
from typing import List, Dict, Any, Tuple

from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

_SUPPORTED = ("perplexity", "claude")


def _primary_provider() -> str:
    provider = os.getenv("LLM_PROVIDER", "perplexity").strip().lower()
    if provider not in _SUPPORTED:
        logger.warning(
            "LLM_PROVIDER='%s' is unknown. Falling back to 'perplexity'. "
            "Supported values: %s",
            provider,
            _SUPPORTED,
        )
        return "perplexity"
    return provider


def _fallback_provider(primary: str) -> str:
    return "claude" if primary == "perplexity" else "perplexity"


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

    raise ValueError(f"Unknown LLM provider: {provider!r}")


def call_chat(
    messages: List[Dict[str, str]],
    model: str | None = None,
    timeout: int = 30,
) -> Tuple[Dict[str, Any], str]:
    """
    Unified LLM call.  Reads LLM_PROVIDER from the environment and routes to
    the appropriate backend.  If the primary provider fails, automatically
    tries the other one (if its API key is present).

    messages: list of {"role": "system"|"user"|"assistant", "content": "..."}
    returns:  (raw_response_dict, content_string)
    """
    primary = _primary_provider()
    fallback = _fallback_provider(primary)

    try:
        logger.debug("LLM call via primary provider: %s", primary)
        return _call_provider(primary, messages, model, timeout)
    except Exception as primary_err:
        logger.warning(
            "Primary LLM provider '%s' failed (%s). Attempting fallback to '%s'.",
            primary,
            primary_err,
            fallback,
        )

    # Check whether the fallback provider has a key configured before trying it
    fallback_key_vars = {
        "perplexity": "PERPLEXITY_API_KEY",
        "claude": "ANTHROPIC_API_KEY",
    }
    if not os.getenv(fallback_key_vars[fallback]):
        raise RuntimeError(
            f"Primary provider '{primary}' failed and fallback provider "
            f"'{fallback}' has no API key set ({fallback_key_vars[fallback]}). "
            f"Original error: {primary_err}"
        ) from primary_err

    try:
        logger.info("LLM call via fallback provider: %s", fallback)
        return _call_provider(fallback, messages, model, timeout)
    except Exception as fallback_err:
        raise RuntimeError(
            f"Both LLM providers failed. "
            f"Primary ('{primary}'): {primary_err}. "
            f"Fallback ('{fallback}'): {fallback_err}."
        ) from fallback_err
