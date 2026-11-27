<#
.SYNOPSIS
    SmartKrushi Django Backend Runner
.DESCRIPTION
    Starts the Django REST API server on 0.0.0.0:8000 or runs automated tests.
#>

[CmdletBinding()]
param(
    [int]$Port = 8000,
    [switch]$TestOnly = $false
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $ProjectRoot "backend"
$ManagePy = Join-Path $BackendDir "manage.py"

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "         SMARTKRUSHI — DJANGO BACKEND LAUNCHER" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green

# Locate Python Interpreter (check local venv first, then sibling venv_agri)
$venvPython = Join-Path $BackendDir "venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    $altVenv = Join-Path $ProjectRoot "..\agri_data\venv_agri\Scripts\python.exe"
    if (Test-Path $altVenv) {
        $venvPython = $altVenv
    } else {
        $venvPython = "python.exe"
    }
}

Write-Host "Using Python: $venvPython" -ForegroundColor Gray
Write-Host "Backend Path: $BackendDir" -ForegroundColor Gray

# If TestOnly flag was supplied, execute Django tests
if ($TestOnly) {
    Write-Host "`nRunning SmartKrushi Backend Automated Tests..." -ForegroundColor Cyan
    Push-Location $BackendDir
    try {
        & $venvPython $ManagePy test tests
    } finally {
        Pop-Location
    }
    exit $LASTEXITCODE
}

# Check if port is already active to prevent duplicate process conflicts
$portInUse = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️ Warning: Port $Port is already in use by process PID $($portInUse[0].OwningProcess)." -ForegroundColor Yellow
    Write-Host "Another server may already be running. Terminating or attaching..." -ForegroundColor Yellow
}

Write-Host "`nStarting Django REST Framework server at http://0.0.0.0:$Port/ ..." -ForegroundColor Green
Write-Host "Local documentation: http://127.0.0.1:$Port/api/docs/ (Swagger UI)" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the backend server.`n" -ForegroundColor Gray

$host.UI.RawUI.WindowTitle = "SmartKrushi - Django Backend (Port $Port)"
Push-Location $BackendDir
try {
    & $venvPython $ManagePy runserver "0.0.0.0:$Port"
} finally {
    Pop-Location
}
