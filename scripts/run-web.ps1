<#
.SYNOPSIS
    SmartKrushi Web App Launcher (React + Vite)
.DESCRIPTION
    Starts the React + Vite web application on http://localhost:5173
#>

[CmdletBinding()]
param(
    [int]$Port = 5173
)

$ErrorActionPreference = 'Stop'
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$WebDir = Join-Path $ProjectRoot "web"

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "         SMARTKRUSHI - REACT WEB APP LAUNCHER" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Web App Dir : $WebDir" -ForegroundColor Gray
Write-Host "Target Port : $Port" -ForegroundColor Gray
Write-Host ""

# Check if port is already occupied
try {
    $existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($existing) {
        $pids = $existing | Select-Object -ExpandProperty OwningProcess -Unique
        Write-Host "Warning: Port $Port is currently in use by PID(s): $($pids -join ', ')." -ForegroundColor Yellow
        Write-Host "Terminating previous process to ensure fresh start..." -ForegroundColor Yellow
        foreach ($p in $pids) {
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        }
        Start-Sleep -Milliseconds 800
    }
} catch {
    # Non-admin or cmdlet restriction, continue
}

Write-Host "Starting React + Vite dev server at http://localhost:$Port/ ..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop.`n" -ForegroundColor Gray

try {
    $host.UI.RawUI.WindowTitle = "SmartKrushi - Web App (Port $Port)"
} catch {}

Push-Location $WebDir
try {
    npx vite --host 0.0.0.0 --port $Port --strictPort
} finally {
    Pop-Location
}
