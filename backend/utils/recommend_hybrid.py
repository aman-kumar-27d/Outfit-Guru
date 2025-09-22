# rule+ML hybrid recommender (uses LLM suggestions)

# backend/utils/recommend_hybrid.py
from typing import List, Dict, Any, Optional, Set

# small rule-base for demo; extend as needed
OCCASION_RULES = {
    "casual": {
        "allowed": ["tshirt", "jeans", "sneakers", "denim jacket", "backpack"],
        "suggest": ["denim jacket", "white sneakers", "watch"]
    },
    "party": {
        "allowed": ["dress", "heels", "clutch"],
        "suggest": ["heels", "clutch", "statement jewelry"]
    },
    "college": {
        "allowed": ["tshirt", "jeans", "sneakers", "backpack"],
        "suggest": ["backpack", "casual jacket"]
    },
    "ceremony": {
        "allowed": ["saree", "kurta", "formal shoes", "ethnic jewelry"],
        "suggest": ["ethnic jewelry", "formal shoes"]
    }
}

def rule_based_suggestions(detections: List[Dict[str,Any]], occasion: str) -> List[Dict[str,Any]]:
    """Return basic suggestions from rules (simple)."""
    occ = (occasion or "casual").lower()
    rules = OCCASION_RULES.get(occ, OCCASION_RULES["casual"])
    suggestions = []
    for s in rules["suggest"]:
        suggestions.append({"label": s, "source": "rule"})
    return suggestions

# Placeholder for ML retrieval — replace with FAISS+FashionCLIP later
def retrieve_similar_items(detections: List[Dict[str,Any]], top_k: int = 5) -> List[Dict[str,Any]]:
    """
    Implement your ML retrieval here (compute embeddings for detected items,
    search FAISS index, return candidate items).
    For now returns empty list (or mock items).
    """
    # Mock example (you should replace)
    return []


def generate_hybrid_recommendations(
    detections: List[Dict[str,Any]],
    person_regions: List[Dict[str,Any]],
    occasion: Optional[str] = "casual",
    llm_suggestions: Optional[List[str]] = None,
    exclude_previous: Optional[Set[str]] = None
) -> List[Dict[str,Any]]:
    """
    Combine LLM suggestions, rules, and ML retrieval, filter duplicates and excluded items.
    Returns list of recommendation dicts: {"label":..., "source": "ml|rule|llm"}
    """
    if exclude_previous is None:
        exclude_previous = set()
    llm_suggestions = llm_suggestions or []

    recs = []
    seen = set()

    # 1) Prefer LLM suggested additions (higher priority)
    for item in llm_suggestions:
        key = item.lower()
        if key not in exclude_previous and key not in seen:
            recs.append({"label": item, "source": "llm"})
            seen.add(key)

    # 2) Rule-based suggestions
    for r in rule_based_suggestions(detections, occasion):
        key = r["label"].lower()
        if key not in exclude_previous and key not in seen:
            recs.append(r)
            seen.add(key)

    # 3) ML retrieval (if any)
    ml_items = retrieve_similar_items(detections)
    for m in ml_items:
        key = m["label"].lower()
        if key not in exclude_previous and key not in seen:
            recs.append({**m, "source": "ml"})
            seen.add(key)

    return recs
