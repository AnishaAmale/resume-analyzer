"""
FastAPI application for Resume Analyzer & ATS Optimization.
"""
import os
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from parser import parse_file, normalize_text
from extractor import (
    extract_contact_info,
    extract_sections,
    extract_skills,
    extract_bullet_points
)
from analyzer import calculate_ats_score, match_with_job_description
from rewriter import enhance_bullet_rule_based, enhance_with_gemini
from samples import SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS

app = FastAPI(
    title="Resume Analyzer & ATS Optimizer API",
    description="Backend API for parsing resumes, calculating ATS compatibility, matching with job descriptions, and STAR enhancements.",
    version="1.0.0"
)

# Enable CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RewriteRequest(BaseModel):
    bullet: str
    target_role: Optional[str] = None
    api_key: Optional[str] = None


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "service": "Resume Analyzer API", "version": "1.0.0"}


@app.get("/api/samples")
def get_sample_data():
    """Return preloaded sample resumes and job postings for 1-click demos."""
    return {
        "resumes": SAMPLE_RESUMES,
        "job_descriptions": SAMPLE_JOB_DESCRIPTIONS
    }


@app.post("/api/analyze")
async def analyze_resume(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    x_gemini_api_key: Optional[str] = Header(None)
):
    """
    Analyze resume via file upload (PDF/DOCX/TXT) or pasted raw text,
    matching against optional job description.
    """
    raw_text = ""
    filename = "pasted_resume.txt"
    
    # Handle file upload if provided
    if file and file.filename:
        filename = file.filename
        file_bytes = await file.read()
        if not file_bytes:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        try:
            raw_text = parse_file(file_bytes, filename)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse resume file: {str(e)}")
    elif resume_text and resume_text.strip():
        raw_text = normalize_text(resume_text)
    else:
        raise HTTPException(
            status_code=400,
            detail="Please provide a resume file or paste resume text."
        )
        
    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from resume.")
        
    jd_clean = normalize_text(job_description or "")
    
    # 1. Extraction Pipeline
    contact_info = extract_contact_info(raw_text)
    sections = extract_sections(raw_text)
    skills = extract_skills(raw_text)
    bullets = extract_bullet_points(raw_text)
    
    # 2. ATS Analysis
    ats_result = calculate_ats_score(
        text=raw_text,
        contact_info=contact_info,
        sections=sections,
        skills_by_cat=skills,
        bullets=bullets
    )
    
    # 3. Job Description Match
    jd_match_result = match_with_job_description(
        resume_text=raw_text,
        jd_text=jd_clean,
        resume_skills=skills
    )
    
    # 4. Generate automated enhancements for first 3 weak/improvable bullets
    weak_bullet_samples = []
    candidate_role = contact_info.get("name") or "Candidate"
    
    # Find bullets that lack metrics or have passive language
    candidate_bullets = [b for b in ats_result.get("analyzed_bullets", []) if b["score"] < 80]
    if not candidate_bullets:
        candidate_bullets = ats_result.get("analyzed_bullets", [])[:3]
        
    for item in candidate_bullets[:3]:
        bullet_text = item["text"]
        enhanced_opts = enhance_bullet_rule_based(bullet_text)
        weak_bullet_samples.append({
            "original": bullet_text,
            "current_score": item["score"],
            "rating": item["rating"],
            "suggestions": enhanced_opts
        })
        
    return {
        "filename": filename,
        "contact_info": contact_info,
        "sections": {k: v for k, v in sections.items() if v},
        "skills": skills,
        "bullet_count": len(bullets),
        "ats_analysis": ats_result,
        "job_match": jd_match_result,
        "quick_enhancements": weak_bullet_samples,
        "raw_text": raw_text
    }


@app.post("/api/rewrite-bullet")
def rewrite_bullet(payload: RewriteRequest):
    """
    Rewrite an individual bullet point using STAR framework with metrics and power verbs.
    """
    if not payload.bullet.strip():
        raise HTTPException(status_code=400, detail="Bullet point text is required.")
        
    # Check if Gemini key is provided
    api_key = payload.api_key or os.environ.get("GEMINI_API_KEY")
    if api_key:
        ai_rewrites = enhance_with_gemini(payload.bullet, api_key, payload.target_role)
        if ai_rewrites:
            return {"source": "gemini_ai", "rewrites": ai_rewrites}
            
    # Fallback to smart rule-based engine
    rule_rewrites = enhance_bullet_rule_based(payload.bullet, payload.target_role)
    return {"source": "rule_based_star", "rewrites": rule_rewrites}


# Mount production frontend build if available
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
