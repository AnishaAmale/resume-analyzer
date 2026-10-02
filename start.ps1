Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       ResumeIQ - AI & ATS Resume Analyzer" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Launching server at http://127.0.0.1:8000 ..." -ForegroundColor Green
Write-Host "Press Ctrl+C to terminate." -ForegroundColor Yellow
Write-Host ""

$BackendDir = Join-Path $PSScriptRoot "backend"
Set-Location $BackendDir
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
