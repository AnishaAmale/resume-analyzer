"""
STAR Method Bullet Point Enhancer and AI Integration.
"""
import os
import re
import json
from typing import Dict, List, Any, Optional
import requests

from analyzer import ALL_ACTION_VERBS, POWER_ACTION_VERBS, WEAK_PHRASES


# Action verbs mapped to replacement domains
ENHANCEMENT_TEMPLATES = [
    {
        "style": "Metric-Driven (STAR)",
        "verb": "Optimized",
        "format": lambda base, verb: f"{verb} {base.lstrip()}, boosting system performance by 35% and supporting 50,000+ monthly active users."
    },
    {
        "style": "Technical Architecture",
        "verb": "Architected",
        "format": lambda base, verb: f"{verb} and engineered end-to-end solutions for {base.lstrip()}, enhancing codebase reliability and reducing deployment cycle times by 40%."
    },
    {
        "style": "Leadership & Business Impact",
        "verb": "Spearheaded",
        "format": lambda base, verb: f"{verb} cross-functional initiatives for {base.lstrip()}, aligning technical deliverables with product goals to deliver results 2 weeks ahead of schedule."
    }
]


def clean_bullet_starter(bullet: str) -> str:
    """Strip weak introductory phrases like 'worked on', 'responsible for'."""
    cleaned = bullet.strip()
    
    # Strip leading bullet symbol
    cleaned = re.sub(r"^(?:•|-|\*|\d+\.|\u2022)\s*", "", cleaned)
    
    # Replace weak starting phrases
    for weak in WEAK_PHRASES:
        pattern = rf"^(?:i was\s+)?{re.escape(weak)}\s+"
        if re.search(pattern, cleaned, re.IGNORECASE):
            cleaned = re.sub(pattern, "", cleaned, flags=re.IGNORECASE)
            break
            
    # Also clean "i " or "helped to "
    cleaned = re.sub(r"^(?:i\s+|helped\s+to\s+|tasked\s+to\s+)", "", cleaned, flags=re.IGNORECASE)
    
    # Convert first character to lowercase for smooth clause attachment if needed
    return cleaned.strip()


def enhance_bullet_rule_based(bullet: str, target_role: Optional[str] = None) -> List[Dict[str, str]]:
    """
    Generate 3 enhanced STAR-method variations of a resume bullet point using heuristic templates.
    """
    cleaned_base = clean_bullet_starter(bullet)
    
    # Choose dynamic verbs based on context
    v1_verbs = ["Engineered", "Optimized", "Automated", "Streamlined", "Accelerated"]
    v2_verbs = ["Architected", "Implemented", "Designed", "Developed", "Deployed"]
    v3_verbs = ["Spearheaded", "Led", "Delivered", "Championed", "Overhauled"]
    
    # Simple hash or determinism based on string length
    idx = len(cleaned_base) % len(v1_verbs)
    verb1 = v1_verbs[idx]
    verb2 = v2_verbs[idx]
    verb3 = v3_verbs[idx]
    
    # Extract core subject or action from cleaned_base
    words = cleaned_base.split()
    if words:
        # If the first word ends with 'ing' (e.g. "building APIs"), we can adapt
        first = words[0].lower()
        if first.endswith("ing"):
            words = words[1:]
        core_activity = " ".join(words)
    else:
        core_activity = "core product feature sets"
        
    variations = [
        {
            "title": "Metric-Driven (Quantifiable STAR)",
            "action_verb": verb1,
            "text": f"{verb1} {core_activity}, achieving a 30% reduction in processing latency and scaling throughput to 100K+ daily transactions.",
            "rationale": "Adds concrete quantifiable business impact (%) and volume metrics (100K+) that ATS parsers reward."
        },
        {
            "title": "Technical Architecture & Systems",
            "action_verb": verb2,
            "text": f"{verb2} resilient, modular architecture for {core_activity}, integrating automated testing to elevate test coverage to 92%.",
            "rationale": "Focuses on engineering excellence, technical design, and automated testing rigor."
        },
        {
            "title": "Leadership & Cross-Functional Impact",
            "action_verb": verb3,
            "text": f"{verb3} development and delivery of {core_activity} across a cross-functional squad of 6 engineers, accelerating sprint velocity by 25%.",
            "rationale": "Demonstrates teamwork, leadership, collaboration, and direct organizational velocity improvement."
        }
    ]
    
    return variations


def enhance_with_gemini(
    bullet: str,
    api_key: str,
    target_role: Optional[str] = None
) -> Optional[List[Dict[str, str]]]:
    """
    Optional enhancement using Google Gemini API if user supplies an API key.
    """
    if not api_key:
        return None
        
    prompt = f"""You are an elite executive resume coach and ATS optimization specialist.
Rewrite this resume bullet point into 3 vastly superior, high-impact versions following the STAR method (Situation, Task, Action, Result).
Target Role: {target_role or "Software Professional"}
Original Bullet: "{bullet}"

Output STRICTLY a valid JSON array of 3 objects with keys:
- "title": (e.g. "Metric-Driven STAR", "Technical Depth", "Strategic Impact")
- "action_verb": The power action verb used (e.g. "Architected", "Engineered", "Optimized")
- "text": The enhanced bullet point text (including realistic metrics like %, scale, time saved)
- "rationale": 1 sentence explaining why this version is powerful for ATS and recruiters.

Do not include markdown codeblocks or any commentary outside the JSON array.
"""
    
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4}
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=12)
        if response.status_code == 200:
            result = response.json()
            raw_text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            # Clean possible markdown fencing
            raw_text = re.sub(r"^```json\s*", "", raw_text)
            raw_text = re.sub(r"^```\s*", "", raw_text)
            raw_text = re.sub(r"\s*```$", "", raw_text)
            data = json.loads(raw_text)
            if isinstance(data, list) and len(data) > 0:
                return data
    except Exception as e:
        print(f"Gemini API call failed or timed out: {e}")
        
    return None
