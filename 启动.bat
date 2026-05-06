@echo off
cd /d "%~dp0"
echo Starting Resume Builder...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\launch.ps1"
if errorlevel 1 pause
