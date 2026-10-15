# GitHub Pages Deployment Verification Script
# Purpose: Verify all prerequisites before GitHub Pages deployment
# Usage: .\verify-deployment.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Pages Deployment Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Initialize counters
$passCount = 0
$failCount = 0

# Function to check and report
function Test-Item {
    param(
        [string]$Name,
        [scriptblock]$TestScript,
        [string]$FailMessage
    )
    
    $result = & $TestScript
    
    if ($result) {
        Write-Host "✅ $Name" -ForegroundColor Green
        $script:passCount++
    } else {
        Write-Host "❌ $Name" -ForegroundColor Red
        if ($FailMessage) {
            Write-Host "   Fix: $FailMessage" -ForegroundColor Yellow
        }
        $script:failCount++
    }
}

# Test Node.js
Write-Host "`n[1/10] Checking Node.js..." -ForegroundColor Cyan
Test-Item "Node.js installed" {
    $version = node --version 2>$null
    if ($version) {
        Write-Host "       Version: $version" -ForegroundColor Gray
        return $true
    }
    return $false
} "Install Node.js v18+ from https://nodejs.org"

# Test npm
Write-Host "`n[2/10] Checking npm..." -ForegroundColor Cyan
Test-Item "npm installed" {
    $version = npm --version 2>$null
    if ($version) {
        Write-Host "       Version: $version" -ForegroundColor Gray
        return $true
    }
    return $false
} "Install npm v9+ with Node.js"

# Test git
Write-Host "`n[3/10] Checking Git..." -ForegroundColor Cyan
Test-Item "Git installed" {
    $version = git --version 2>$null
    if ($version) {
        Write-Host "       $version" -ForegroundColor Gray
        return $true
    }
    return $false
} "Install Git from https://git-scm.com"

# Test git configuration
Write-Host "`n[4/10] Checking Git configuration..." -ForegroundColor Cyan
Test-Item "Git user configured" {
    $name = git config --global user.name 2>$null
    $email = git config --global user.email 2>$null
    if ($name -and $email) {
        Write-Host "       User: $name <$email>" -ForegroundColor Gray
        return $true
    }
    return $false
} "Run: git config --global user.name 'Your Name' && git config --global user.email 'your@email.com'"

# Test .github/workflows/deploy.yml
Write-Host "`n[5/10] Checking deployment workflow..." -ForegroundColor Cyan
Test-Item "Workflow file exists (.github/workflows/deploy.yml)" {
    return Test-Path ".\.github\workflows\deploy.yml"
} "Create .github/workflows/deploy.yml with GitHub Actions configuration"

# Test vite.config.ts
Write-Host "`n[6/10] Checking Vite configuration..." -ForegroundColor Cyan
Test-Item "Vite config exists (vite.config.ts)" {
    return Test-Path ".\vite.config.ts"
} "Create vite.config.ts with GitHub Pages base path configuration"

# Test package.json
Write-Host "`n[7/10] Checking package.json..." -ForegroundColor Cyan
Test-Item "package.json exists" {
    return Test-Path ".\package.json"
} "Ensure package.json is in project root"

# Check homepage in package.json
Write-Host "`n[8/10] Checking package.json homepage..." -ForegroundColor Cyan
$homepageCheck = (Get-Content -Path ".\package.json" -Raw | ConvertFrom-Json).homepage
if ($homepageCheck -and $homepageCheck -ne "" -and $homepageCheck -like "*github.io*") {
    Write-Host "✅ Homepage URL configured" -ForegroundColor Green
    Write-Host "   URL: $homepageCheck" -ForegroundColor Gray
    $passCount++
} else {
    Write-Host "⚠️  Homepage URL not configured" -ForegroundColor Yellow
    Write-Host "   Fix: Update package.json with:" -ForegroundColor Yellow
    Write-Host "   `"homepage`": `"http://tdevopssrv1/DefaultCollection/ETC/_git/Professional-KPI-Analysis-Dashboard/`"" -ForegroundColor Yellow
    $failCount++
}

# Test local build
Write-Host "`n[9/10] Testing local build..." -ForegroundColor Cyan
if ((Test-Path ".\node_modules" -PathType Container) -and (Test-Path ".\node_modules\.bin\vite" -PathType Leaf)) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    $passCount++
} else {
    Write-Host "⚠️  Dependencies not installed" -ForegroundColor Yellow
    Write-Host "   Run: npm install" -ForegroundColor Yellow
    $failCount++
}

# Test dist folder
Write-Host "`n[10/10] Checking build output..." -ForegroundColor Cyan
if (Test-Path ".\dist" -PathType Container) {
    $distSize = (Get-ChildItem -Path ".\dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "✅ Build output exists (dist folder)" -ForegroundColor Green
    Write-Host "   Size: $([math]::Round($distSize, 2)) MB" -ForegroundColor Gray
    $passCount++
} else {
    Write-Host "⚠️  dist folder not found (build output)" -ForegroundColor Yellow
    Write-Host "   Run: npm run build" -ForegroundColor Yellow
    $failCount++
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Passed: $passCount" -ForegroundColor Green
Write-Host "⚠️  Issues: $failCount" -ForegroundColor Yellow
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "🎉 All checks passed! Ready for deployment." -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m 'feat: github pages deployment ready'" -ForegroundColor White
    Write-Host "3. git push -u origin main" -ForegroundColor White
    Write-Host "4. Monitor deployment in Actions tab" -ForegroundColor White
    exit 0
} else {
    Write-Host "⚠️  Please fix the issues above before deployment." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "- npm install" -ForegroundColor White
    Write-Host "- npm run build" -ForegroundColor White
    Write-Host "- Update homepage in package.json" -ForegroundColor White
    Write-Host "- git config --global user.name 'Your Name'" -ForegroundColor White
    exit 1
}
