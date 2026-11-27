<#
.SYNOPSIS
    SmartKrushi React Native / Expo Frontend Runner
.DESCRIPTION
    Launches Metro bundler and Expo dev server from frontend directory.
#>

[CmdletBinding()]
param(
    [switch]$Clear = $true,
    [switch]$Android = $false,
    [switch]$Web = $false
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "         SMARTKRUSHI — EXPO MOBILE FRONTEND LAUNCHER" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Frontend Path: $FrontendDir" -ForegroundColor Gray

# Verify Node.js
try {
    $nodeVer = & node --version 2>&1
    Write-Host "Node.js Version: $nodeVer" -ForegroundColor Gray
} catch {
    Write-Error "Node.js runtime not found. Please install Node.js."
    exit 1
}

# Check if node_modules exists
$nodeModules = Join-Path $FrontendDir "node_modules"
if (-not (Test-Path $nodeModules)) {
    Write-Host "node_modules not found. Running npm install first..." -ForegroundColor Yellow
    Push-Location $FrontendDir
    try {
        & npm install
    } finally {
        Pop-Location
    }
}

$host.UI.RawUI.WindowTitle = "SmartKrushi - Expo Mobile Frontend"

Push-Location $FrontendDir
try {
    $expoArgs = @("expo", "start")
    if ($Clear) { $expoArgs += "--clear" }
    if ($Android) { $expoArgs += "--android" }
    if ($Web) { $expoArgs += "--web" }

    Write-Host "`nLaunching Expo Dev Server..." -ForegroundColor Green
    Write-Host "Shortcuts:" -ForegroundColor Cyan
    Write-Host "  - Scan the terminal QR code in Expo Go on Android" -ForegroundColor Cyan
    Write-Host "  - Press 'a' for Android Emulator" -ForegroundColor Cyan
    Write-Host "  - Press 'w' for Web Browser" -ForegroundColor Cyan
    Write-Host "  - Press 'r' to reload`n" -ForegroundColor Cyan

    & npx $expoArgs
} finally {
    Pop-Location
}
