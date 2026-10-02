"""
Unit tests for Resume Analyzer backend.
"""
import sys
import os

# Ensure backend directory is in path
sys.path.insert(0, os.path.dirname(__file__))

from parser import normalize_text
from extractor import extract_contact_info, extract_sections, extract_skills, extract_bullet_points
from analyzer import calculate_ats_score, match_with_job_description, evaluate_bullet
from rewriter import enhance_bullet_rule_based
from samples import SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS


def test_normalization():
    raw = "Line 1\r\n\u2022 Item A\r\n\u2022 Item B\n\n\nLine 2"
    clean = normalize_text(raw)
    assert "\u2022 Item A" in clean
    assert "\r" not in clean
    print("test_normalization passed")


def test_contact_extraction():
    sample = SAMPLE_RESUMES["senior_fullstack"]["text"]
    info = extract_contact_info(sample)
    assert info["email"] == "alex.chen.dev@gmail.com"
    assert info["phone"] is not None
    assert "linkedin.com/in/alexchen-tech" in info["linkedin"]
    assert "github.com/alexchen-dev" in info["github"]
    assert "alex" in info["name"].lower()
    print("[PASS] test_contact_extraction passed")


def test_skills_extraction():
    sample = SAMPLE_RESUMES["senior_fullstack"]["text"]
    skills = extract_skills(sample)
    assert "TypeScript" in skills["languages"]
    assert "React" in skills["frameworks"]
    assert "AWS" in skills["cloud_devops"]
    assert "PostgreSQL" in skills["databases"]
    print("[PASS] test_skills_extraction passed")


def test_ats_scoring_comparison():
    # Alex Chen (Senior Full Stack) should score high (80+)
    alex_text = SAMPLE_RESUMES["senior_fullstack"]["text"]
    alex_contact = extract_contact_info(alex_text)
    alex_sec = extract_sections(alex_text)
    alex_skills = extract_skills(alex_text)
    alex_bullets = extract_bullet_points(alex_text)
    alex_ats = calculate_ats_score(alex_text, alex_contact, alex_sec, alex_skills, alex_bullets)
    
    assert alex_ats["overall_score"] >= 80, f"Expected Alex >= 80, got {alex_ats['overall_score']}"
    assert alex_ats["grade"] in ["A+", "A"]
    
    # Jordan Miller (Junior Web Dev) should score lower due to missing metrics, clichés
    jordan_text = SAMPLE_RESUMES["junior_developer"]["text"]
    jordan_contact = extract_contact_info(jordan_text)
    jordan_sec = extract_sections(jordan_text)
    jordan_skills = extract_skills(jordan_text)
    jordan_bullets = extract_bullet_points(jordan_text)
    jordan_ats = calculate_ats_score(jordan_text, jordan_contact, jordan_sec, jordan_skills, jordan_bullets)
    
    assert jordan_ats["overall_score"] < alex_ats["overall_score"]
    assert len(jordan_ats["cliches_found"]) > 0
    print(f"[PASS] test_ats_scoring_comparison passed: Alex {alex_ats['overall_score']} vs Jordan {jordan_ats['overall_score']}")


def test_job_description_matching():
    alex_text = SAMPLE_RESUMES["senior_fullstack"]["text"]
    alex_skills = extract_skills(alex_text)
    jd_text = SAMPLE_JOB_DESCRIPTIONS["fullstack_fintech"]["text"]
    
    match = match_with_job_description(alex_text, jd_text, alex_skills)
    assert match["has_jd"] is True
    assert match["match_score"] >= 65, f"Expected match score >= 65, got {match['match_score']}"
    assert "React" in match["matched_skills"].get("frameworks", []) or "React" in str(match["matched_skills"])
    print(f"[PASS] test_job_description_matching passed: Match score {match['match_score']}%")


def test_bullet_enhancement():
    weak_bullet = "Worked on company website using HTML and CSS"
    suggestions = enhance_bullet_rule_based(weak_bullet)
    assert len(suggestions) == 3
    for s in suggestions:
        assert len(s["text"]) > len(weak_bullet)
        assert s["action_verb"] is not None
    print("[PASS] test_bullet_enhancement passed")


if __name__ == "__main__":
    test_normalization()
    test_contact_extraction()
    test_skills_extraction()
    test_ats_scoring_comparison()
    test_job_description_matching()
    test_bullet_enhancement()
    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")
