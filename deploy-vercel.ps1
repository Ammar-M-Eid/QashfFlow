# QashFlow Automated Vercel Deployment Script
# Run this after training your model with .\train.ps1

param(
    [switch]$SkipTraining,
    [switch]$Production,
    [string]$FrontendUrl = "",
    [string]$BackendUrl = ""
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 QashFlow Vercel Deployer" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "Install it with: npm install -g vercel" -ForegroundColor Yellow
    exit 1
}

# Check if Git LFS is installed
$gitLfsInstalled = Get-Command git-lfs -ErrorAction SilentlyContinue
if (-not $gitLfsInstalled) {
    Write-Host "❌ Git LFS not found!" -ForegroundColor Red
    Write-Host "Install it from: https://git-lfs.github.com/" -ForegroundColor Yellow
    exit 1
}

# Step 1: Check for trained models
Write-Host "📦 Step 1: Checking for trained models..." -ForegroundColor Green
$checkpoints = Get-ChildItem -Path "backend\saved_models" -Filter "quantum_tcn_*.pth" -ErrorAction SilentlyContinue

if (-not $checkpoints -and -not $SkipTraining) {
    Write-Host "⚠️  No trained model found!" -ForegroundColor Yellow
    Write-Host "Running training script first..." -ForegroundColor Yellow
    Write-Host ""
    
    & ".\train.ps1"
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Training failed! Fix errors and try again." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Training complete!" -ForegroundColor Green
    Write-Host ""
}
elseif (-not $checkpoints) {
    Write-Host "❌ No trained model found and -SkipTraining specified!" -ForegroundColor Red
    Write-Host "Run: .\train.ps1" -ForegroundColor Yellow
    exit 1
}
else {
    Write-Host "✅ Found trained model: $($checkpoints[0].Name)" -ForegroundColor Green
    Write-Host ""
}

# Step 2: Setup Git LFS
Write-Host "📦 Step 2: Setting up Git LFS..." -ForegroundColor Green
git lfs install 2>&1 | Out-Null

# Track model files
git lfs track "*.pth" 2>&1 | Out-Null
git lfs track "*.pkl" 2>&1 | Out-Null
git lfs track "*.ipynb" 2>&1 | Out-Null

Write-Host "✅ Git LFS configured" -ForegroundColor Green
Write-Host ""

# Step 3: Commit models if not already committed
Write-Host "📦 Step 3: Committing models to Git..." -ForegroundColor Green
git add .gitattributes backend/saved_models/ 2>&1 | Out-Null

$gitStatus = git status --porcelain
if ($gitStatus) {
    git commit -m "Add trained 3-photon model checkpoints [automated]" 2>&1 | Out-Null
    Write-Host "✅ Models committed" -ForegroundColor Green
}
else {
    Write-Host "✅ Models already committed" -ForegroundColor Green
}
Write-Host ""

# Step 4: Deploy Backend
Write-Host "📦 Step 4: Deploying Backend..." -ForegroundColor Green
Push-Location backend

if ($Production) {
    Write-Host "Deploying to production..." -ForegroundColor Yellow
    $backendDeploy = vercel --prod --yes 2>&1
}
else {
    Write-Host "Deploying to preview..." -ForegroundColor Yellow
    $backendDeploy = vercel --yes 2>&1
}

# Extract backend URL from output
$backendUrlMatch = $backendDeploy | Select-String -Pattern "https://[^\s]+" | Select-Object -First 1
if ($backendUrlMatch) {
    $BackendUrl = $backendUrlMatch.Matches[0].Value
    Write-Host "✅ Backend deployed: $BackendUrl" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Could not extract backend URL automatically" -ForegroundColor Yellow
    if (-not $BackendUrl) {
        $BackendUrl = Read-Host "Enter your backend URL"
    }
}

Pop-Location
Write-Host ""

# Step 5: Deploy Frontend
Write-Host "📦 Step 5: Deploying Frontend..." -ForegroundColor Green

# Set backend URL environment variable
$env:NEXT_PUBLIC_API_URL = $BackendUrl

if ($Production) {
    Write-Host "Deploying to production..." -ForegroundColor Yellow
    $frontendDeploy = vercel --prod --yes 2>&1
}
else {
    Write-Host "Deploying to preview..." -ForegroundColor Yellow
    $frontendDeploy = vercel --yes 2>&1
}

# Extract frontend URL
$frontendUrlMatch = $frontendDeploy | Select-String -Pattern "https://[^\s]+" | Select-Object -First 1
if ($frontendUrlMatch) {
    $FrontendUrl = $frontendUrlMatch.Matches[0].Value
    Write-Host "✅ Frontend deployed: $FrontendUrl" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Could not extract frontend URL automatically" -ForegroundColor Yellow
    if (-not $FrontendUrl) {
        $FrontendUrl = Read-Host "Enter your frontend URL"
    }
}
Write-Host ""

# Step 6: Configure CORS
Write-Host "📦 Step 6: Configuring CORS..." -ForegroundColor Green
Push-Location backend

Write-Host "Adding CORS origin: $FrontendUrl" -ForegroundColor Yellow

# This needs manual input, so we'll just show the command
Write-Host ""
Write-Host "Run this command to configure CORS:" -ForegroundColor Yellow
Write-Host "  vercel env add ALLOWED_ORIGINS" -ForegroundColor Cyan
Write-Host "  Then enter: $FrontendUrl" -ForegroundColor Cyan
Write-Host "  Then redeploy: vercel --prod" -ForegroundColor Cyan
Write-Host ""

Pop-Location

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🎉 Deployment Complete!" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend URL:  $FrontendUrl" -ForegroundColor Green
Write-Host "Backend URL:   $BackendUrl" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure CORS on backend (see above)" -ForegroundColor White
Write-Host "2. Test health endpoint: curl $BackendUrl/health" -ForegroundColor White
Write-Host "3. Visit your app: $FrontendUrl" -ForegroundColor White
Write-Host ""
Write-Host "Happy quantum trading! 📊✨" -ForegroundColor Cyan
