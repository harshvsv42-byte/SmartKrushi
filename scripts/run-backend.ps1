<#
.SYNOPSIS
    SmartKrushi Django Backend Runner

.DESCRIPTION
    Starts the SmartKrushi Django REST API server or runs backend tests.

.PARAMETER Port
    Port used by Django's development server. Default: 8000.

.PARAMETER TestOnly
    Runs the Django test suite instead of starting the server.

.EXAMPLE
    .\run-backend.ps1

.EXAMPLE
    .\run-backend.ps1 -Port 8001

.EXAMPLE
    .\run-backend.ps1 -TestOnly
#>

[CmdletBinding()]
param(
    [ValidateRange(1, 65535)]
    [int]$Port = 8000,

    [switch]$TestOnly
)

$ErrorActionPreference = 'Stop'

# Resolve project paths from this script's location.
$ScriptDir  = $PSScriptRoot
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $ProjectRoot 'backend'
$ManagePy   = Join-Path $BackendDir 'manage.py'

Write-Host ''
Write-Host '============================================================' -ForegroundColor Green
Write-Host '             SMARTKRUSHI - DJANGO BACKEND' -ForegroundColor Green
Write-Host '============================================================' -ForegroundColor Green

# Confirm that the Django project exists.
if (-not (Test-Path -LiteralPath $ManagePy -PathType Leaf)) {
    throw "Django manage.py was not found: $ManagePy"
}

# Find Python: backend virtual environment, sibling agri_data
# virtual environment, then Python available on PATH.
$PythonCandidates = @(
    (Join-Path $BackendDir 'venv\Scripts\python.exe'),
    (Join-Path $ProjectRoot '..\agri_data\venv_agri\Scripts\python.exe')
)

$venvPython = $null

foreach ($candidate in $PythonCandidates) {
    if (Test-Path -LiteralPath $candidate -PathType Leaf) {
        $venvPython = (Resolve-Path -LiteralPath $candidate).Path
        break
    }
}

if (-not $venvPython) {
    $pythonCommand = Get-Command 'python.exe' -ErrorAction SilentlyContinue
    if (-not $pythonCommand) {
        $pythonCommand = Get-Command 'python' -ErrorAction SilentlyContinue
    }

    if ($pythonCommand) {
        $venvPython = $pythonCommand.Source
    }
}

if (-not $venvPython) {
    throw 'Python was not found. Install Python or configure the backend virtual environment.'
}

Write-Host "Project root : $ProjectRoot" -ForegroundColor Gray
Write-Host "Backend path : $BackendDir" -ForegroundColor Gray
Write-Host "Python       : $venvPython" -ForegroundColor Gray
Write-Host ''

# Run automated tests when -TestOnly is supplied.
if ($TestOnly) {
    Write-Host 'Running SmartKrushi backend tests...' -ForegroundColor Cyan

    Push-Location $BackendDir
    try {
        & $venvPython $ManagePy test tests
        $commandExitCode = $LASTEXITCODE
    }
    finally {
        Pop-Location
    }

    if ($null -eq $commandExitCode) {
        $commandExitCode = 1
    }

    if ($commandExitCode -eq 0) {
        Write-Host 'Backend tests completed successfully.' -ForegroundColor Green
    }
    else {
        Write-Host "Backend tests failed. Exit code: $commandExitCode" -ForegroundColor Red
    }

    exit $commandExitCode
}

# Check whether another process is already listening on the requested port.
$portConnections = @()
try {
    $portConnections = @(
        Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    )
}
catch {
    # If this cmdlet is unavailable or access is restricted, let Django
    # report any port-binding problem when it starts.
}

if ($portConnections.Count -gt 0) {
    $processIdInUse = $portConnections[0].OwningProcess
    $processName = 'Unknown'

    try {
        $processName = (Get-Process -Id $processIdInUse -ErrorAction Stop).ProcessName
    }
    catch {
        # The process may have exited between the port check and this lookup.
    }

    Write-Host "⚠️ Port $Port is already in use by PID $processIdInUse ($processName)." -ForegroundColor Yellow
    Write-Host "Terminating lingering process on port $Port to ensure a clean start..." -ForegroundColor Yellow
    try {
        Stop-Process -Id $processIdInUse -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 800
    } catch {}
}

# Set a descriptive console title when running in an interactive terminal.
try {
    $Host.UI.RawUI.WindowTitle = "SmartKrushi - Django Backend (Port $Port)"
}
catch {
    # Ignore title-setting errors in terminals that do not support it.
}

Write-Host "Starting Django server on http://0.0.0.0:$Port/" -ForegroundColor Green
Write-Host "Local API docs: http://127.0.0.1:$Port/api/docs/" -ForegroundColor Cyan
Write-Host 'Press Ctrl+C to stop the backend server.' -ForegroundColor Gray
Write-Host ''

Push-Location $BackendDir
try {
    & $venvPython $ManagePy runserver "0.0.0.0:$Port"
    $commandExitCode = $LASTEXITCODE
}
finally {
    Pop-Location
}

if ($null -ne $commandExitCode -and $commandExitCode -ne 0) {
    Write-Host "Django server exited with code $commandExitCode." -ForegroundColor Red
    exit $commandExitCode
}
