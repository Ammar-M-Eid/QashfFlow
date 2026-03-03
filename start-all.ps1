# Master Startup Script - Runs both Frontend and Backend
# This script starts both services in separate windows

Write-Host ""
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  QashFlow - Full Stack Startup" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Check if backend exists
if (-not (Test-Path "backend")) {
    Write-Host "Backend directory not found!" -ForegroundColor Red
    exit 1
}

# Check if frontend dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install frontend dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "Creating .env.local..." -ForegroundColor Yellow
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "Created .env.local" -ForegroundColor Green
}

# Check if backend .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "Backend .env not found!" -ForegroundColor Yellow
    Write-Host "Creating from template..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host ""
    Write-Host "IMPORTANT: Edit backend\.env with your model paths!" -ForegroundColor Red
    Write-Host "  - MODEL_CHECKPOINT_PATH" -ForegroundColor Yellow
    Write-Host "  - SCALER_PATH" -ForegroundColor Yellow
    Write-Host ""
    $null = Read-Host "Press Enter to continue or Ctrl+C to exit and configure"
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Green
Write-Host ""

# Start Backend in new window
Write-Host "Starting Backend (http://localhost:8001)..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; .\run.ps1"

# Wait a bit for backend to start
Write-Host "Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start Frontend in new window
Write-Host "Starting Frontend (http://localhost:3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot'; .\start.ps1"

Write-Host ""
Write-Host "Both services are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:8001" -ForegroundColor White
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Two new windows have opened for each service." -ForegroundColor Cyan
Write-Host "Check those windows for logs and errors." -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
