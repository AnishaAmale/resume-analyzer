"""
ATS Compatibility and Job Description Matching Engine.
"""
import re
from typing import Dict, List, Any, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from extractor import (
    extract_contact_info,
    extract_sections,
    extract_skills,
    extract_bullet_points,
    SKILL_TAXONOMY
)

# Power action verbs that recruiters and ATS systems favor
POWER_ACTION_VERBS = {
    "leadership": [
        "led", "spearheaded", "directed", "managed", "orchestrated", "mentored",
        "championed", "supervised", "guided", "steered", "governed"
    ],
    "engineering": [
        "architected", "engineered", "developed", "built", "implemented", "designed",
        "constructed", "programmed", "refactored", "automated", "deployed", "integrated"
    ],
    "optimization": [
        "optimized", "accelerated", "reduced", "increased", "maximized", "streamlined",
        "enhanced", "boosted", "consolidated", "upgraded", "scaled", "amplified"
    ],
    "problem_solving": [
        "resolved", "debugged", "diagnosed", "troubleshot", "overhauled", "solved",
        "remediated", "audited", "revamped", "modernized"
    ]
}

ALL_ACTION_VERBS = set()
for verbs in POWER_ACTION_VERBS.values():
    ALL_ACTION_VERBS.update(verbs)

# Passive or weak phrases to avoid
WEAK_PHRASES = [
    "responsible for", "duties included", "worked on", "helped with",
    "assisted in", "tasked with", "handled", "participated in", "served as"
]

# Clichés and empty buzzwords
CLICHE_BUZZWORDS = [
    "hard worker", "hardworking", "go-getter", "team player", "think outside the box",
    "rockstar", "ninja", "guru", "detail-oriented", "self-starter", "fast learner",
    "results-driven", "synergy", "dynamic", "motivated", "strategic thinker"
]


def check_quantifiable_impact(bullet: str) -> bool:
    """Check if a bullet point contains measurable metrics (numbers, %, $, etc.)."""
    # Look for %, $, numbers, multiplier (2x, 3x), or scale numbers (100k+, 5M)
    patterns = [
        r"\b\d+%\b",                  # percentages: 25%, 100%
        r"[\$€£]\s?\d+(?:[.,]\d+)?",  # money: $500, $1.2M
        r"\b\d+\s?(?:k|m|b)\b",       # shorthand: 50k, 10M
        r"\b\d+x\b",                  # multiplier: 3x, 10x
        r"\b\d+(?:,\d{3})+\b",        # formatted numbers: 10,000
        r"\b\d+\s?(?:users|clients|requests|ms|seconds|minutes|hours|days|teams)\b",
        r"\b(?:reduced|increased|boosted|grew|saved|cut)\s+(?:by\s+)?\d+"
    ]
    for p in patterns:
        if re.search(p, bullet, re.IGNORECASE):
            return True
            
    # Also check if any standalone number > 1 exists (e.g. "trained 15 engineers")
    numbers = re.findall(r"\b\d+\b", bullet)
    if any(int(n) > 1 for n in numbers if len(n) <= 6):
        return True
        
    return False


def evaluate_bullet(bullet: str) -> Dict[str, Any]:
    """Analyze a single bullet point for quality, metrics, and action verbs."""
    bullet_clean = bullet.strip()
    words = bullet_clean.split()
    first_word = words[0].lower().rstrip(".,;:") if words else ""
    
    starts_with_action_verb = first_word in ALL_ACTION_VERBS
    has_metrics = check_quantifiable_impact(bullet_clean)
    
    # Check for weak phrases
    found_weak = [p for p in WEAK_PHRASES if p in bullet_clean.lower()]
    
    # Calculate single bullet impact rating
    rating = "Needs Improvement"
    score = 40
    if starts_with_action_verb and has_metrics:
        rating = "Strong (STAR)"
        score = 95
    elif starts_with_action_verb:
        rating = "Good (Missing Metrics)"
        score = 75
    elif has_metrics:
        rating = "Moderate (Passive Phrasing)"
        score = 65
    elif found_weak:
        rating = "Weak (Passive Language)"
        score = 30
        
    return {
        "text": bullet_clean,
        "starts_with_action_verb": starts_with_action_verb,
        "first_word": first_word,
        "has_metrics": has_metrics,
        "weak_phrases": found_weak,
        "rating": rating,
        "score": score
    }


def calculate_ats_score(
    text: str,
    contact_info: Dict[str, Any],
    sections: Dict[str, str],
    skills_by_cat: Dict[str, List[str]],
    bullets: List[str]
) -> Dict[str, Any]:
    """
    Calculate comprehensive ATS compatibility score out of 100 with detailed breakdown.
    """
    sub_scores = {}
    feedback_notes = []
    strengths = []
    critical_fixes = []
    
    # 1. Contact Info Completeness (Max 10)
    contact_pts = 0
    if contact_info.get("name"):
        contact_pts += 2
    if contact_info.get("email"):
        contact_pts += 3
        strengths.append("Professional email address detected.")
    else:
        critical_fixes.append("Missing email address in resume header.")
        
    if contact_info.get("phone"):
        contact_pts += 3
    else:
        critical_fixes.append("Missing contact phone number.")
        
    if contact_info.get("linkedin") or contact_info.get("github") or contact_info.get("portfolio"):
        contact_pts += 2
        strengths.append("Professional profile link (LinkedIn / GitHub) present.")
    else:
        feedback_notes.append("Consider adding your LinkedIn or GitHub profile link.")
    sub_scores["contact"] = min(10, contact_pts)
    
    # 2. Section Completeness (Max 15)
    section_pts = 0
    has_exp = bool(sections.get("experience"))
    has_edu = bool(sections.get("education"))
    has_skills = bool(sections.get("skills")) or any(skills_by_cat.values())
    has_summary = bool(sections.get("summary"))
    
    if has_exp:
        section_pts += 5
    else:
        critical_fixes.append("Add a distinct 'Work Experience' or 'Employment History' section header.")
        
    if has_edu:
        section_pts += 4
    else:
        critical_fixes.append("Add an 'Education' section with your degree and institution.")
        
    if has_skills:
        section_pts += 4
    else:
        critical_fixes.append("Add a dedicated 'Technical Skills' or 'Core Competencies' section.")
        
    if has_summary:
        section_pts += 2
    sub_scores["sections"] = min(15, section_pts)
    
    # 3. Formatting & Length Hygiene (Max 15)
    word_count = len(text.split())
    bullet_count = len(bullets)
    format_pts = 0
    
    # Word count check
    if 350 <= word_count <= 950:
        format_pts += 8
        strengths.append(f"Ideal resume length: {word_count} words (typically 1-2 pages).")
    elif 200 <= word_count < 350:
        format_pts += 5
        feedback_notes.append("Resume is somewhat brief. Elaborate on project achievements and responsibilities.")
    elif 950 < word_count <= 1400:
        format_pts += 5
        feedback_notes.append("Resume is somewhat lengthy. Consider condensing to 1-2 focused pages.")
    else:
        format_pts += 2
        critical_fixes.append("Word count is outside standard ATS range (aim for 400-800 words).")
        
    # Bullet points check
    if bullet_count >= 8:
        format_pts += 7
        strengths.append(f"Well-structured with {bullet_count} discrete bullet points.")
    elif 4 <= bullet_count < 8:
        format_pts += 4
        feedback_notes.append("Add more bullet points under each role to break down accomplishments.")
    else:
        format_pts += 1
        critical_fixes.append("Low bullet point count. ATS parsers prefer structured bullet statements over paragraphs.")
    sub_scores["formatting"] = min(15, format_pts)
    
    # 4. Measurable Impact & Metrics (Max 25)
    analyzed_bullets = [evaluate_bullet(b) for b in bullets]
    metric_bullets = [b for b in analyzed_bullets if b["has_metrics"]]
    metric_ratio = len(metric_bullets) / len(analyzed_bullets) if analyzed_bullets else 0
    
    impact_pts = round(metric_ratio * 25)
    impact_pts = min(25, max(0, impact_pts))
    sub_scores["impact"] = impact_pts
    
    if metric_ratio >= 0.40:
        strengths.append(f"High measurable impact: {round(metric_ratio * 100)}% of bullets include quantifiable outcomes (%, $, metrics).")
    elif metric_ratio >= 0.20:
        feedback_notes.append(f"Only {round(metric_ratio * 100)}% of bullets have numbers. Try quantifying results (e.g. '% increase', 'time saved', 'scale supported').")
    else:
        critical_fixes.append("Lacks quantifiable data. Transform bullet points using the STAR method: Result = Action + Metric.")
        
    # 5. Action Verbs & Power Phrasing (Max 15)
    action_bullets = [b for b in analyzed_bullets if b["starts_with_action_verb"]]
    action_ratio = len(action_bullets) / len(analyzed_bullets) if analyzed_bullets else 0
    
    action_pts = round(action_ratio * 15)
    action_pts = min(15, max(0, action_pts))
    sub_scores["action_verbs"] = action_pts
    
    if action_ratio >= 0.50:
        strengths.append(f"Strong active voice: {round(action_ratio * 100)}% of bullets start with power action verbs.")
    else:
        feedback_notes.append("Begin more bullet points with strong action verbs (e.g. Engineered, Spearheaded, Optimized) instead of passive words.")
        
    # 6. Skills Depth & Variety (Max 20)
    total_skills = sum(len(s) for s in skills_by_cat.values())
    skills_pts = 0
    if total_skills >= 15:
        skills_pts = 20
        strengths.append(f"Rich skill profile with {total_skills} recognized industry skills across categories.")
    elif total_skills >= 10:
        skills_pts = 16
        strengths.append(f"Good skills catalog: {total_skills} detected skills.")
    elif total_skills >= 5:
        skills_pts = 11
        feedback_notes.append("Expand your skills list with specific frameworks, databases, and DevOps tools.")
    else:
        skills_pts = 5
        critical_fixes.append("Very few technical or domain skills detected. Ensure standard skill terms are explicitly written.")
    sub_scores["skills_depth"] = skills_pts
    
    # 7. Deductions for Buzzwords & Clichés (Up to -10)
    text_lower = text.lower()
    found_cliches = []
    for c in CLICHE_BUZZWORDS:
        if re.search(rf"\b{re.escape(c)}\b", text_lower):
            found_cliches.append(c)
            
    deduction = min(10, len(found_cliches) * 2)
    if found_cliches:
        feedback_notes.append(f"Avoid vague clichés: {', '.join(f'\"{c}\"' for c in found_cliches[:4])}. Demonstrate these qualities with concrete results instead.")
        
    raw_total = sum(sub_scores.values()) - deduction
    overall_score = max(10, min(100, raw_total))
    
    # Assign Letter Grade
    if overall_score >= 90:
        grade = "A+"
        grade_label = "Exceptional ATS Ready"
    elif overall_score >= 80:
        grade = "A"
        grade_label = "Strong Candidate"
    elif overall_score >= 70:
        grade = "B"
        grade_label = "Competitive"
    elif overall_score >= 60:
        grade = "C"
        grade_label = "Needs Optimization"
    else:
        grade = "D"
        grade_label = "Significant ATS Risks"
        
    return {
        "overall_score": overall_score,
        "grade": grade,
        "grade_label": grade_label,
        "sub_scores": sub_scores,
        "word_count": word_count,
        "bullet_count": bullet_count,
        "metric_percentage": round(metric_ratio * 100),
        "action_verb_percentage": round(action_ratio * 100),
        "cliches_found": found_cliches,
        "strengths": strengths,
        "critical_fixes": critical_fixes,
        "feedback_notes": feedback_notes,
        "analyzed_bullets": analyzed_bullets
    }


def match_with_job_description(
    resume_text: str,
    jd_text: str,
    resume_skills: Dict[str, List[str]]
) -> Dict[str, Any]:
    """
    Match resume against job description using TF-IDF cosine similarity and skill gap analysis.
    """
    if not jd_text.strip():
        return {
            "has_jd": False,
            "match_score": 0,
            "semantic_similarity": 0,
            "keyword_match_score": 0,
            "matched_skills": {},
            "missing_skills": {},
            "matched_count": 0,
            "missing_count": 0,
            "match_percentage": 0,
            "priority_recommendations": []
        }
        
    # 1. Cosine similarity with TF-IDF
    vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=1500)
    try:
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        cos_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        semantic_score = round(cos_sim * 100, 1)
    except Exception:
        semantic_score = 50.0
        
    # 2. Extract JD skills
    jd_skills_by_cat = extract_skills(jd_text)
    
    # Flatten resume skills to lowercase set
    resume_skills_set = set()
    for cat, s_list in resume_skills.items():
        for s in s_list:
            resume_skills_set.add(s.lower())
            
    matched_by_cat: Dict[str, List[str]] = {}
    missing_by_cat: Dict[str, List[str]] = {}
    
    total_jd_skills = 0
    matched_skills_count = 0
    
    for cat, skills in jd_skills_by_cat.items():
        matched_by_cat[cat] = []
        missing_by_cat[cat] = []
        
        for s in skills:
            total_jd_skills += 1
            if s.lower() in resume_skills_set:
                matched_by_cat[cat].append(s)
                matched_skills_count += 1
            else:
                missing_by_cat[cat].append(s)
                
    # Keyword overlap score
    keyword_score = round((matched_skills_count / total_jd_skills * 100), 1) if total_jd_skills > 0 else semantic_score
    
    # Cross-document cosine similarity naturally hovers around 0.20-0.40; normalize for intuitive display
    normalized_semantic = min(100.0, round(semantic_score * 2.5, 1))
    
    # Blended match score (70% keyword match, 30% normalized semantic context)
    blended_score = round(0.70 * keyword_score + 0.30 * normalized_semantic)
    blended_score = max(5, min(99, blended_score))
    
    # Generate targeted recommendations
    recommendations = []
    
    # Check missing tech skills
    missing_tech = missing_by_cat.get("languages", []) + missing_by_cat.get("frameworks", []) + missing_by_cat.get("cloud_devops", []) + missing_by_cat.get("databases", [])
    if missing_tech:
        top_tech = missing_tech[:5]
        recommendations.append(f"High Priority: Incorporate essential required technologies: {', '.join(top_tech)} into your Skills and Project sections.")
        
    missing_data_ai = missing_by_cat.get("ai_data", [])
    if missing_data_ai:
        recommendations.append(f"Data & AI Skills: Consider highlighting experience with {', '.join(missing_data_ai[:3])}.")
        
    missing_soft = missing_by_cat.get("soft_skills", [])
    if missing_soft:
        recommendations.append(f"Include evidence of core competencies: {', '.join(missing_soft[:3])} in your bullet points.")
        
    return {
        "has_jd": True,
        "match_score": blended_score,
        "semantic_similarity": semantic_score,
        "keyword_match_score": keyword_score,
        "matched_skills": matched_by_cat,
        "missing_skills": missing_by_cat,
        "matched_count": matched_skills_count,
        "missing_count": total_jd_skills - matched_skills_count,
        "total_jd_skills": total_jd_skills,
        "priority_recommendations": recommendations
    }
