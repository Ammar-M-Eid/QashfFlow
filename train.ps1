# QashFlow Model Training Script
# Run this ONCE to train models, then cached for all future runs

Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "QashFlow Model Training" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will train the Quantum TCN model on train.xlsx" -ForegroundColor Yellow
Write-Host "Training takes 2-3 minutes and only needs to be done ONCE" -ForegroundColor Yellow
Write-Host ""

# Check if train.xlsx exists
if (-not (Test-Path "train.xlsx")) {
    Write-Host "ERROR: train.xlsx not found in project root" -ForegroundColor Red
    Write-Host "Please add train.xlsx before training" -ForegroundColor Red
    exit 1
}

# Check if backend virtual environment exists
$venvPath = "backend\.venv\Scripts\Activate.ps1"
if (-not (Test-Path $venvPath)) {
    Write-Host "Virtual environment not found. Creating..." -ForegroundColor Yellow
    Set-Location backend
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    Set-Location ..
}

Write-Host "Activating backend environment..." -ForegroundColor Green

# Run training script
Set-Location backend
& .\.venv\Scripts\python.exe train_models.py

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host "Training Complete!" -ForegroundColor Green
    Write-Host "================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Start backend: .\start-all.ps1" -ForegroundColor White
    Write-Host "  2. Backend will load the trained checkpoint instantly" -ForegroundColor White
    Write-Host "  3. No waiting for training on startup!" -ForegroundColor White
    Write-Host ""
}
else {
    Write-Host ""
    Write-Host "ERROR: Training failed. Check error messages above." -ForegroundColor Red
    Write-Host ""
}

Set-Location ..
