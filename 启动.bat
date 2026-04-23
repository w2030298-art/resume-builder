@echo off
cd /d "%~dp0"
echo Starting resume builder...
start http://localhost:3000
npx next dev