@echo off
echo ========================================================
echo        ResumeIQ - AI & ATS Resume Analyzer
echo ========================================================
echo.
echo Starting FastAPI Backend + Frontend at http://127.0.0.1:8000 ...
echo.

cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause
