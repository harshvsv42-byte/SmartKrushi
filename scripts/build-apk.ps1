<#
.SYNOPSIS
    SmartKrushi EAS Android APK Builder
.DESCRIPTION
    Builds a standalone Android APK using Expo Application Services (EAS).
#>

[CmdletBinding()]
param()

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "         SMARTKRUSHI — ANDROID APK CLOUD BUILDER (EAS)" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host "Building installable Android APK with profile 'preview'..." -ForegroundColor Cyan

Push-Location $FrontendDir
try {
    & npx eas-cli@latest build -p android --profile preview
} finally {
    Pop-Location
}
