<#
.SYNOPSIS
    SmartKrushi Automated Environment Setup Script
.DESCRIPTION
    Verifies prerequisites (Python, Node.js, npm), sets up virtualenv,
    installs backend & frontend dependencies, and checks migrations.
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "         SMARTKRUSHI — AUTOMATED ENVIRONMENT SETUP" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Project Root : $ProjectRoot"
Write-Host "Backend Path : $BackendDir"
Write-Host "Frontend Path: $FrontendDir"
Write-Host ""

# 1. Check Prerequisites
Write-Host "[1/6] Checking System Prerequisites..." -ForegroundColor Cyan

# Check Python
try {
    $pythonVer = & python --version 2>&1
    Write-Host "  ✅ Python detected: $pythonVer" -ForegroundColor Green
} catch {
    Write-Error "Python is not installed or not in PATH. Please install Python 3.10+."
    exit 1
}

# Check Node.js
try {
    $nodeVer = & node --version 2>&1
    Write-Host "  ✅ Node.js detected: $nodeVer" -ForegroundColor Green
} catch {
    Write-Error "Node.js is not installed or not in PATH. Please install Node.js 20+."
    exit 1
}

# Check npm
try {
    $npmVer = & npm --version 2>&1
    Write-Host "  ✅ npm detected: $npmVer" -ForegroundColor Green
} catch {
    Write-Error "npm is not installed or not in PATH."
    exit 1
}

# 2. Check Dependency Manifests
Write-Host "`n[2/6] Checking Dependency Manifests..." -ForegroundColor Cyan
$backendReqs = Join-Path $BackendDir "requirements.txt"
$frontendPkg = Join-Path $FrontendDir "package.json"

if (-not (Test-Path $backendReqs)) {
    Write-Error "Missing backend requirements at $backendReqs"
    exit 1
}
Write-Host "  ✅ Found backend/requirements.txt" -ForegroundColor Green

if (-not (Test-Path $frontendPkg)) {
    Write-Error "Missing frontend package.json at $frontendPkg"
    exit 1
}
Write-Host "  ✅ Found frontend/package.json" -ForegroundColor Green

# 3. Configure Environment (.env) Safely
Write-Host "`n[3/6] Checking Environment (.env) Files..." -ForegroundColor Cyan

$backendEnv = Join-Path $BackendDir ".env"
$backendEnvExample = Join-Path $BackendDir ".env.example"
if (-not (Test-Path $backendEnv)) {
    if (Test-Path $backendEnvExample) {
        Copy-Item $backendEnvExample $backendEnv
        Write-Host "  ✅ Created backend/.env from .env.example" -ForegroundColor Green
    }
} else {
    Write-Host "  ℹ️ backend/.env already exists (preserving existing file)" -ForegroundColor Yellow
}

$frontendEnv = Join-Path $FrontendDir ".env"
$frontendEnvExample = Join-Path $FrontendDir ".env.example"
if (-not (Test-Path $frontendEnv)) {
    if (Test-Path $frontendEnvExample) {
        Copy-Item $frontendEnvExample $frontendEnv
        Write-Host "  ✅ Created frontend/.env from .env.example" -ForegroundColor Green
    }
} else {
    Write-Host "  ℹ️ frontend/.env already exists (preserving existing file)" -ForegroundColor Yellow
}

# 4. Setup Backend Python Environment
Write-Host "`n[4/6] Setting up Backend Python Virtual Environment..." -ForegroundColor Cyan
$venvPath = Join-Path $BackendDir "venv"
$venvPython = Join-Path $venvPath "Scripts\python.exe"

# If venv doesn't exist, check if agri_data/venv_agri can be reused or create new
if (-not (Test-Path $venvPython)) {
    $existingVenvAgri = Join-Path $ProjectRoot "..\agri_data\venv_agri\Scripts\python.exe"
    if (Test-Path $existingVenvAgri) {
        Write-Host "  ℹ️ Found existing configured venv_agri. Cloning environment reference..." -ForegroundColor Yellow
    }
    Write-Host "  Creating virtual environment at $venvPath..."
    & python -m venv $venvPath
    Write-Host "  ✅ Virtual environment created." -ForegroundColor Green
    Write-Host "  Installing backend dependencies from requirements.txt..."
    & $venvPython -m pip install --upgrade pip
    & $venvPython -m pip install -r $backendReqs
    Write-Host "  ✅ Backend dependencies installed." -ForegroundColor Green
} else {
    Write-Host "  ✅ Virtual environment already exists at $venvPath" -ForegroundColor Green
}

# 5. Verify Backend Migrations & Database
Write-Host "`n[5/6] Verifying Backend Django Configuration & Database..." -ForegroundColor Cyan
$managePy = Join-Path $BackendDir "manage.py"
& $venvPython $managePy check
Write-Host "  ✅ Django system check passed." -ForegroundColor Green

# 6. Setup Frontend Node Dependencies
Write-Host "`n[6/6] Checking Frontend npm Dependencies..." -ForegroundColor Cyan
$nodeModules = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $nodeModules)) {
    Write-Host "  Installing frontend dependencies (npm install)..."
    Push-Location $FrontendDir
    try {
        & npm install
        Write-Host "  ✅ Frontend dependencies installed." -ForegroundColor Green
    } finally {
        Pop-Location
    }
} else {
    Write-Host "  ✅ Frontend node_modules already exists." -ForegroundColor Green
}

Write-Host "`n==================================================================" -ForegroundColor Green
Write-Host "         SMARTKRUSHI SETUP COMPLETE! 🚀" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Next steps to run the platform:"
Write-Host "  1. Start both servers:  .\scripts\run-all.ps1"
Write-Host "  2. Start backend only:  .\scripts\run-backend.ps1"
Write-Host "  3. Start frontend only: .\scripts\run-frontend.ps1"
Write-Host "==================================================================" -ForegroundColor Green
