"""
Test FastAPI endpoints using starlette TestClient.
"""
from fastapi.testclient import TestClient
from main import app
from samples import SAMPLE_RESUMES, SAMPLE_JOB_DESCRIPTIONS

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"
    print("[PASS] /api/health passed")

def test_samples():
    res = client.get("/api/samples")
    assert res.status_code == 200
    data = res.json()
    assert "senior_fullstack" in data["resumes"]
    assert "fullstack_fintech" in data["job_descriptions"]
    print("[PASS] /api/samples passed")

def test_analyze():
    alex_text = SAMPLE_RESUMES["senior_fullstack"]["text"]
    jd_text = SAMPLE_JOB_DESCRIPTIONS["fullstack_fintech"]["text"]
    
    res = client.post("/api/analyze", data={
        "resume_text": alex_text,
        "job_description": jd_text
    })
    assert res.status_code == 200
    data = res.json()
    assert "ats_analysis" in data
    assert "job_match" in data
    assert data["ats_analysis"]["overall_score"] >= 80
    assert data["job_match"]["match_score"] >= 65
    print("[PASS] /api/analyze passed with score:", data["ats_analysis"]["overall_score"])

def test_rewrite():
    res = client.post("/api/rewrite-bullet", json={
        "bullet": "Worked on the backend API for users",
        "target_role": "Backend Engineer"
    })
    assert res.status_code == 200
    data = res.json()
    assert "rewrites" in data
    assert len(data["rewrites"]) == 3
    print("[PASS] /api/rewrite-bullet passed")

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert "root" in res.text
    print("[PASS] Static frontend served at / successfully")

if __name__ == "__main__":
    test_health()
    test_samples()
    test_analyze()
    test_rewrite()
    test_root()
    print("\n>>> ALL API AND FRONTEND ENDPOINTS VERIFIED! <<<")
