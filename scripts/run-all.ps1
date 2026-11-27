<#
.SYNOPSIS
    SmartKrushi Full-Stack Launcher - Starts Backend + Web App Concurrently
.DESCRIPTION
    Opens two separate PowerShell terminal windows:
      1. Django REST API backend on http://127.0.0.1:8000/
      2. React + Vite web app on http://localhost:5173/
#>

[CmdletBinding()]
param()

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendScript = Join-Path $ScriptDir "run-backend.ps1"
$WebScript = Join-Path $ScriptDir "run-web.ps1"

Write-Host "==================================================================" -ForegroundColor Green
Write-Host "         SMARTKRUSHI - FULL STACK LAUNCHER" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green

Write-Host ""
Write-Host "1. Starting Django Backend on http://127.0.0.1:8000/ ..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$BackendScript`""

Start-Sleep -Seconds 2

Write-Host "2. Starting React Web App on http://localhost:5173/ ..." -ForegroundColor Cyan
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-File", "`"$WebScript`""

Write-Host ""
Write-Host "Both servers have been launched in separate terminal windows." -ForegroundColor Green
Write-Host ""
Write-Host "   Backend API  : http://127.0.0.1:8000/api/v1/" -ForegroundColor Gray
Write-Host "   API Docs     : http://127.0.0.1:8000/api/docs/" -ForegroundColor Gray
Write-Host "   Web App      : http://localhost:5173/" -ForegroundColor Gray
Write-Host ""
Write-Host "   Open your browser at: http://localhost:5173" -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor Green
