# LLM provider router
# Reads LLM_PROVIDER from .env and delegates to the right client.
# Supported values: "perplexity" (default), "claude", "gemini"
# Auto-falls back across the remaining configured providers when the primary call fails.

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
    Unified LLM call. Reads LLM_PROVIDER from the environment and routes to
    the appropriate backend. If the primary provider fails, automatically
    tries the remaining providers that have API keys configured.

    messages: list of {"role": "system"|"user"|"assistant", "content": "..."}
    returns:  (raw_response_dict, content_string)
    """
    primary = _primary_provider()
    attempted_errors: List[str] = []

    for index, provider in enumerate(_provider_chain(primary)):
        api_key_var = _API_KEYS[provider]
        if not os.getenv(api_key_var):
            attempted_errors.append(
                f"{provider}: missing required env var {api_key_var}"
            )
            continue

        try:
            if index == 0:
                logger.debug("LLM call via primary provider: %s", provider)
            else:
                logger.info("LLM call via fallback provider: %s", provider)

            provider_model = model if provider == primary else None
            return _call_provider(provider, messages, provider_model, timeout)
        except Exception as provider_err:
            attempted_errors.append(f"{provider}: {provider_err}")
            logger.warning(
                "LLM provider '%s' failed. Trying next configured provider.",
                provider,
                exc_info=True,
            )

    raise RuntimeError(
        "All configured LLM providers failed. "
        + " | ".join(attempted_errors)
    )
