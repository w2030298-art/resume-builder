@echo off
setlocal
cd /d "%~dp0"
set "APP_URL=http://localhost:3001"

echo Starting resume builder on %APP_URL% ...

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Please install Node.js first.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo node_modules not found. Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

powershell -NoProfile -Command "if (Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue) { exit 0 } else { exit 1 }"
if not errorlevel 1 (
  echo Port 3001 is already running. Opening browser...
  start "" "%APP_URL%"
  exit /b 0
)

start "" "%APP_URL%"
call npm run dev
if errorlevel 1 (
  echo Failed to start resume builder.
  pause
  exit /b 1
)
