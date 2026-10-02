# ResumeIQ - AI & ATS Resume Analyzer App

A full-stack, enterprise-grade **Resume Analyzer & ATS Optimization Application** that evaluates resumes for Applicant Tracking System (ATS) compatibility, measures alignment against target Job Descriptions (JD), audits measurable impact and action verbs, and enhances weak bullet points using the **STAR Method** (Situation, Task, Action, Result).

---

## Key Features

1. **ATS Compatibility Score (0 - 100)**
   - **Quantifiable Impact Scoring (25 pts)**: Audits bullet points for measurable outcomes (`%`, `$`, volume numbers, scale, speedups).
   - **Section Architecture (15 pts)**: Verifies presence and standard naming of Summary, Experience, Education, and Skills.
   - **Action Verbs & Phrasing (15 pts)**: Rewards power action verbs (*Architected, Spearheaded, Optimized*) and penalizes weak passive phrases (*Responsible for, Worked on*).
   - **Formatting & Length Hygiene (15 pts)**: Checks optimal word counts (350–950 words) and bullet distributions.
   - **Skills Depth & Taxonomy (20 pts)**: Categorizes 500+ recognized industry skills into Languages, Frameworks, Cloud & DevOps, Databases, AI/Data, and Soft Skills.
   - **Contact & Profile Integrity (10 pts)**: Detects Email, Phone, LinkedIn, GitHub, and Portfolio URLs.
   - **Cliché & Buzzword Detection**: Deducts points for unsubstantiated buzzwords (*go-getter, team player, think outside the box*).

2. **Job Description Matcher & Keyword Gap Analysis**
   - **TF-IDF & Semantic Cosine Similarity**: Compares resume content against job postings.
   - **Categorized Keyword Overlap**: Displays matched keywords (green) and missing critical keywords (amber/rose).
   - **1-Click Copy**: Click any missing keyword to immediately copy it to the clipboard.
   - **Targeted Priority Fixes**: Specific recommendations for high-priority missing technologies.

3. **Interactive STAR Bullet Enhancer Lab**
   - Analyzes every extracted bullet point and flags quality (`Strong (STAR)`, `Good (Missing Metrics)`, `Weak (Passive Phrasing)`).
   - Generates 3 enhanced STAR variations for any bullet:
     1. **Metric-Driven STAR** (Focuses on % gains, transaction volumes, and scale)
     2. **Technical Architecture** (Focuses on modular systems, test coverage, and code health)
     3. **Leadership & Cross-Functional** (Focuses on ownership, sprint velocity, and mentorship)
   - Works **100% offline** via local heuristic templates.
   - Optional **Google Gemini AI** integration if an API key is configured.

4. **1-Click Preloaded Demos**
   - **Alex Chen** (Senior Full Stack Engineer) — High ATS Score (~83%), high metrics, clean structure.
   - **Priya Sharma** (Machine Learning & AI Engineer) — High Impact (~90%), RAG, PyTorch, Big Data.
   - **Jordan Miller** (Junior Web Developer) — Needs improvement (~33%), lacks metrics, has passive language and clichés (ideal for demonstrating the analyzer's fixing power).
   - Ready-to-test Job Descriptions included: FinTech Full Stack, GenAI / ML Specialist, React Frontend.

5. **Executive Report & Export**
   - Printable PDF view conforming to standard A4/Letter dimensions.
   - JSON export for data archival or programmatic integration.

---

## Tech Stack

- **Backend**: Python 3.13, FastAPI, Uvicorn, PyPDF2, python-docx, Scikit-Learn (TF-IDF, Cosine Similarity), Pydantic.
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Canvas Confetti.
- **Serving**: FastAPI serves both the REST API at `/api` and the compiled production frontend at `/`.

---

## Quick Start

### 1. Launch with One Click
Run either:
```powershell
.\start.ps1
```
or double click:
```cmd
start.bat
```

Open your browser at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**.

### 2. Manual Start (Backend & Development Frontend)

#### Backend:
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### Frontend Development Server (optional, with hot module reload):
```powershell
cd frontend
npm run dev
```
(Frontend dev server runs at `http://localhost:5173` and automatically proxies `/api` to port 8000).

---

## Running Automated Tests

Run backend unit and integration test suites:
```powershell
cd backend
python test_analyzer.py
python test_api.py
```
