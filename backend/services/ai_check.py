"""
AI Auto-Check Pipeline for Seller Submissions.
Validates listing data before it reaches owner approval.
"""

import re
from typing import Any


VALID_DIVISIONS = ["Central", "North", "South", "East", "West"]

VALID_PLOT_TYPES = [
    "Residential Plot", "Commercial Plot", "Agricultural Land",
    "Villa Plot", "DTCP Approved Plot"
]

SPAM_KEYWORDS = [
    "free money", "guaranteed returns", "call now", "limited offer",
    "act fast", "100% profit", "no risk"
]


def run_ai_check(data: dict, existing_plots: list = None) -> dict:
    """
    Run the full AI verification pipeline on a seller submission.

    Returns:
        {
            "passed": bool,
            "checks": [{"field": str, "pass": bool, "message": str}, ...],
            "score": int (0-100)
        }
    """
    checks = []
    existing_plots = existing_plots or []

    # 1. Completeness Check
    required_fields = ["title", "description", "area_sqft", "price", "address", "division", "place"]
    for field in required_fields:
        value = data.get(field, "")
        if not value or (isinstance(value, str) and not value.strip()):
            checks.append({"field": field, "pass": False, "message": f"{field} is required"})
        else:
            checks.append({"field": field, "pass": True, "message": f"{field} provided"})

    # 2. Format Validation
    area = data.get("area_sqft", 0)
    try:
        area = float(area)
        if area <= 0:
            checks.append({"field": "area_format", "pass": False, "message": "Area must be positive"})
        elif area > 1000000:
            checks.append({"field": "area_format", "pass": False, "message": "Area seems unrealistically large"})
        else:
            checks.append({"field": "area_format", "pass": True, "message": f"{area} sq ft is valid"})
    except (ValueError, TypeError):
        checks.append({"field": "area_format", "pass": False, "message": "Area must be a number"})

    price = data.get("price", 0)
    try:
        price = float(price)
        if price <= 0:
            checks.append({"field": "price_format", "pass": False, "message": "Price must be positive"})
        else:
            checks.append({"field": "price_format", "pass": True, "message": f"₹{price:,.0f} is valid"})
    except (ValueError, TypeError):
        checks.append({"field": "price_format", "pass": False, "message": "Price must be a number"})

    # 3. Division & Place Validation
    division = data.get("division", "")
    if division and division not in VALID_DIVISIONS:
        checks.append({"field": "division_valid", "pass": False, "message": f"'{division}' is not a valid division"})
    elif division:
        checks.append({"field": "division_valid", "pass": True, "message": f"Division '{division}' is valid"})

    # 4. Plot Type Validation
    plot_type = data.get("type", "")
    if plot_type and plot_type not in VALID_PLOT_TYPES:
        checks.append({"field": "type_valid", "pass": False, "message": f"Invalid plot type"})
    elif plot_type:
        checks.append({"field": "type_valid", "pass": True, "message": f"Plot type is valid"})

    # 5. Image Check
    images = data.get("images", [])
    if not images or len(images) == 0:
        checks.append({"field": "images", "pass": False, "message": "At least 1 image required"})
    elif len(images) > 5:
        checks.append({"field": "images", "pass": False, "message": "Maximum 5 images allowed"})
    else:
        checks.append({"field": "images", "pass": True, "message": f"{len(images)} image(s) valid"})

    # 6. Description Quality
    description = data.get("description", "")
    if len(description) < 20:
        checks.append({"field": "description_quality", "pass": False, "message": "Description too short (min 20 chars)"})
    elif len(description) > 5000:
        checks.append({"field": "description_quality", "pass": False, "message": "Description too long (max 5000 chars)"})
    else:
        checks.append({"field": "description_quality", "pass": True, "message": "Description length is adequate"})

    # 7. Content Moderation (Spam Detection)
    text_content = f"{data.get('title', '')} {description}".lower()
    spam_found = [kw for kw in SPAM_KEYWORDS if kw in text_content]
    if spam_found:
        checks.append({"field": "content_moderation", "pass": False, "message": f"Spam keywords detected: {', '.join(spam_found)}"})
    else:
        checks.append({"field": "content_moderation", "pass": True, "message": "No spam detected"})

    # 8. Price Reasonability
    if area and price and area > 0 and price > 0:
        price_per_sqft = price / area
        if price_per_sqft < 50:
            checks.append({"field": "price_reason", "pass": False, "message": f"Price per sq ft (₹{price_per_sqft:.0f}) seems too low"})
        elif price_per_sqft > 100000:
            checks.append({"field": "price_reason", "pass": False, "message": f"Price per sq ft (₹{price_per_sqft:.0f}) seems too high"})
        else:
            checks.append({"field": "price_reason", "pass": True, "message": f"₹{price_per_sqft:.0f}/sq ft is reasonable"})

    # 9. Duplicate Detection
    seller_id = data.get("seller_id", "")
    if seller_id and existing_plots:
        duplicates = [
            p for p in existing_plots
            if p.get("seller_id") == seller_id
            and p.get("address", "").lower() == data.get("address", "").lower()
        ]
        if duplicates:
            checks.append({"field": "duplicate", "pass": False, "message": "Similar listing already exists from this seller"})
        else:
            checks.append({"field": "duplicate", "pass": True, "message": "No duplicates found"})

    # Calculate score
    passed_checks = sum(1 for c in checks if c["pass"])
    total_checks = len(checks)
    score = int((passed_checks / total_checks) * 100) if total_checks > 0 else 0
    all_passed = all(c["pass"] for c in checks)

    return {
        "passed": all_passed,
        "checks": checks,
        "score": score
    }
