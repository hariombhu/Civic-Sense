# UrbanTrace backend launcher (uses project venv — do not use bare "python")
$ProjectRoot = $PSScriptRoot
$Python = Join-Path $ProjectRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $Python)) {
    Write-Host "Virtual environment not found. Run setup first:" -ForegroundColor Yellow
    Write-Host "  py -3.12 -m venv .venv"
    Write-Host "  .\.venv\Scripts\pip install -r requirements.txt"
    exit 1
}

Set-Location $ProjectRoot

switch ($args[0]) {
    "migrate" { & $Python manage.py migrate; break }
    "setup" {
        & $Python -m pip install -r requirements.txt
        & $Python manage.py makemigrations
        & $Python manage.py migrate
        & $Python manage.py create_authority
        break
    }
    default {
        Write-Host "Starting Django at http://127.0.0.1:8000/" -ForegroundColor Green
        & $Python manage.py runserver
    }
}
