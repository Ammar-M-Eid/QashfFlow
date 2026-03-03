# QashFlow Deployment Performance Monitor
# Tests your Vercel deployment for performance issues

param(
    [Parameter(Mandatory = $true)]
    [string]$BackendUrl,
    
    [Parameter(Mandatory = $false)]
    [string]$FrontendUrl = "",
    
    [switch]$Detailed
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "📊 QashFlow Performance Monitor" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Function to measure response time
function Measure-Endpoint {
    param(
        [string]$Url,
        [string]$Name
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 30 -UseBasicParsing
        $stopwatch.Stop()
        
        $responseTime = $stopwatch.ElapsedMilliseconds
        
        # Evaluate performance
        $status = if ($responseTime -lt 2000) { "✅ Excellent" }
        elseif ($responseTime -lt 5000) { "⚠️  Acceptable" }
        else { "❌ Slow" }
        
        Write-Host "  Status Code: $($response.StatusCode)" -ForegroundColor Green
        Write-Host "  Response Time: $responseTime ms $status" -ForegroundColor $(if ($responseTime -lt 2000) { "Green" } elseif ($responseTime -lt 5000) { "Yellow" } else { "Red" })
        
        if ($Detailed) {
            Write-Host "  Content Length: $($response.Content.Length) bytes" -ForegroundColor Gray
            Write-Host "  Headers:" -ForegroundColor Gray
            $response.Headers.GetEnumerator() | ForEach-Object {
                Write-Host "    $($_.Key): $($_.Value)" -ForegroundColor DarkGray
            }
        }
        
        return @{
            Success      = $true
            ResponseTime = $responseTime
            StatusCode   = $response.StatusCode
        }
    }
    catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
        return @{
            Success      = $false
            ResponseTime = 0
            Error        = $_.Exception.Message
        }
    }
    
    Write-Host ""
}

# Test 1: Backend Health Endpoint
Write-Host "🔍 Test 1: Backend Health Check" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
$healthResult = Measure-Endpoint -Url "$BackendUrl/health" -Name "Health Endpoint"

if (-not $healthResult.Success) {
    Write-Host "❌ Backend health check failed! Cannot continue." -ForegroundColor Red
    exit 1
}

# Test 2: Backend Training Status
Write-Host "🔍 Test 2: Model Checkpoint Status" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
$trainingResult = Measure-Endpoint -Url "$BackendUrl/training-status" -Name "Training Status"

# Test 3: API Documentation
Write-Host "🔍 Test 3: API Documentation" -ForegroundColor Green
Write-Host "----------------------------------------" -ForegroundColor Gray
$docsResult = Measure-Endpoint -Url "$BackendUrl/docs" -Name "API Docs"

# Test 4: Cold Start Simulation (if specified)
if ($Detailed) {
    Write-Host "🔍 Test 4: Cold Start Simulation (3 consecutive requests)" -ForegroundColor Green
    Write-Host "----------------------------------------" -ForegroundColor Gray
    
    $coldStartTimes = @()
    for ($i = 1; $i -le 3; $i++) {
        Write-Host "Request $i..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2  # Wait between requests
        $result = Measure-Endpoint -Url "$BackendUrl/health" -Name "Request $i"
        $coldStartTimes += $result.ResponseTime
    }
    
    $avgColdStart = ($coldStartTimes | Measure-Object -Average).Average
    Write-Host "Average Response Time: $([int]$avgColdStart) ms" -ForegroundColor Cyan
    Write-Host ""
}

# Test 5: Frontend (if URL provided)
if ($FrontendUrl) {
    Write-Host "🔍 Test 5: Frontend Availability" -ForegroundColor Green
    Write-Host "----------------------------------------" -ForegroundColor Gray
    $frontendResult = Measure-Endpoint -Url $FrontendUrl -Name "Frontend Home"
}

# Summary Report
Write-Host "================================" -ForegroundColor Cyan
Write-Host "📋 Performance Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Backend Summary
Write-Host "Backend Performance:" -ForegroundColor Yellow
Write-Host "  Health Check: $(if ($healthResult.Success) { "$($healthResult.ResponseTime) ms ✅" } else { "Failed ❌" })"
Write-Host "  Training Status: $(if ($trainingResult.Success) { "$($trainingResult.ResponseTime) ms ✅" } else { "Failed ❌" })"
Write-Host "  API Docs: $(if ($docsResult.Success) { "$($docsResult.ResponseTime) ms ✅" } else { "Failed ❌" })"

if ($Detailed) {
    Write-Host "  Avg Cold Start: $([int]$avgColdStart) ms"
}
Write-Host ""

# Frontend Summary
if ($FrontendUrl) {
    Write-Host "Frontend Performance:" -ForegroundColor Yellow
    Write-Host "  Home Page: $(if ($frontendResult.Success) { "$($frontendResult.ResponseTime) ms ✅" } else { "Failed ❌" })"
    Write-Host ""
}

# Performance Rating
$avgBackendTime = ($healthResult.ResponseTime + $trainingResult.ResponseTime + $docsResult.ResponseTime) / 3

Write-Host "Overall Rating:" -ForegroundColor Yellow
if ($avgBackendTime -lt 2000) {
    Write-Host "  🌟 Excellent ($([int]$avgBackendTime) ms avg)" -ForegroundColor Green
    Write-Host "  Your deployment is performing very well!"
}
elseif ($avgBackendTime -lt 5000) {
    Write-Host "  ⚠️  Acceptable ($([int]$avgBackendTime) ms avg)" -ForegroundColor Yellow
    Write-Host "  Performance is adequate but could be improved."
    Write-Host "  Tips:"
    Write-Host "    - Ensure model checkpoint is optimized (3-photon model)"
    Write-Host "    - Check Vercel region matches your location"
    Write-Host "    - Consider upgrading to Vercel Pro for better cold starts"
}
else {
    Write-Host "  ❌ Slow ($([int]$avgBackendTime) ms avg)" -ForegroundColor Red
    Write-Host "  Performance needs improvement!"
    Write-Host "  Troubleshooting:"
    Write-Host "    - Check if checkpoint is too large (should be ~50MB)"
    Write-Host "    - Verify requirements-vercel.txt is being used"
    Write-Host "    - Check Vercel function logs for errors"
    Write-Host "    - Ensure no quantum libraries in production requirements"
}
Write-Host ""

# Recommendations
Write-Host "💡 Recommendations:" -ForegroundColor Cyan
Write-Host ""

if ($healthResult.ResponseTime -gt 5000) {
    Write-Host "  ⚠️  Health endpoint is slow. This might indicate:" -ForegroundColor Yellow
    Write-Host "     - Cold start issues (first request after inactivity)" -ForegroundColor Gray
    Write-Host "     - Large dependencies being loaded" -ForegroundColor Gray
    Write-Host "     - Region mismatch" -ForegroundColor Gray
    Write-Host ""
}

if ($trainingResult.Success) {
    try {
        $statusJson = Invoke-RestMethod -Uri "$BackendUrl/training-status" -Method GET
        if ($statusJson.status -eq "no_checkpoint") {
            Write-Host "  ❌ No model checkpoint found!" -ForegroundColor Red
            Write-Host "     Run: .\train.ps1" -ForegroundColor Yellow
            Write-Host "     Then commit and redeploy" -ForegroundColor Yellow
            Write-Host ""
        }
        elseif ($statusJson.model_loaded -eq $false) {
            Write-Host "  ⚠️  Model checkpoint exists but failed to load" -ForegroundColor Yellow
            Write-Host "     Check Vercel function logs for errors" -ForegroundColor Gray
            Write-Host ""
        }
        else {
            Write-Host "  ✅ Model is loaded and ready for predictions!" -ForegroundColor Green
            Write-Host ""
        }
    }
    catch {
        Write-Host "  ⚠️  Could not parse training status" -ForegroundColor Yellow
        Write-Host ""
    }
}

Write-Host "Test complete! Use -Detailed flag for more information." -ForegroundColor Gray
Write-Host ""

# Exit with appropriate code
if ($healthResult.Success -and $trainingResult.Success) {
    exit 0
}
else {
    exit 1
}
