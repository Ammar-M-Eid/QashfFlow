# Frontend Development Startup Script
# This script helps you quickly start the Next.js development server

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  QashFlow - Frontend Startup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "⚙️  Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.local.example" ".env.local"
    Write-Host "✓ Created .env.local" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend will be available at:" -ForegroundColor Cyan
Write-Host "  → http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Make sure the backend is running on port 8001!" -ForegroundColor Yellow
Write-Host ""

# Start the dev server
npm run dev
