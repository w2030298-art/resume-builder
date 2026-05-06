<#
.SYNOPSIS
  Resume Builder launcher — starts dev server and opens browser when ready.
.DESCRIPTION
  Checks environment (npm, node_modules), detects if port 3001 is already in use,
  starts `npm run dev` in a hidden console, polls the HTTP endpoint until alive,
  then opens the default browser. No console windows are shown to the user.
.NOTES
  Called by: 启动.bat | install-start-menu.ps1 (Start Menu shortcut)
  Port: 3001  URL: http://localhost:3001
#>

$ErrorActionPreference = "Stop"
$ProjectRoot = Resolve-Path "$PSScriptRoot\.." | Select-Object -ExpandProperty Path
$AppUrl       = "http://localhost:3001"

# ── 1. NPM check ───────────────────────────────────────────────
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    [System.Windows.Forms.MessageBox]::Show(
        "npm not found. Please install Node.js first.",
        "Resume Builder", "OK", "Error")
    exit 1
}

# ── 2. Dependencies ────────────────────────────────────────────
Set-Location $ProjectRoot
if (-not (Test-Path "node_modules")) {
    npm install *> "$env:TEMP\resume-builder-npm-install.log"
    if ($LASTEXITCODE -ne 0) {
        [System.Windows.Forms.MessageBox]::Show(
            "npm install failed. See log:`n$env:TEMP\resume-builder-npm-install.log",
            "Resume Builder", "OK", "Error")
        exit 2
    }
}

# ── 3. Already running? ────────────────────────────────────────
$existing = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
if ($existing) {
    Start-Process $AppUrl
    exit 0
}

# ── 4. Start dev server in hidden console ──────────────────────
$npmProc = Start-Process powershell `
    -ArgumentList "-NoProfile -WindowStyle Hidden -Command `"Set-Location '$ProjectRoot'; npm run dev`"" `
    -PassThru `
    -WindowStyle Hidden

# ── 5. Poll until HTTP responds ────────────────────────────────
$timeoutSec = 90
$stopwatch  = [System.Diagnostics.Stopwatch]::StartNew()
$ready      = $false

while ($stopwatch.Elapsed.TotalSeconds -lt $timeoutSec) {
    try {
        $response = Invoke-WebRequest -Uri $AppUrl -TimeoutSec 2 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            $ready = $true
            Start-Process $AppUrl
            break
        }
    } catch {
        # Not ready yet — silently retry
    }
    Start-Sleep -Milliseconds 1500
}

if (-not $ready) {
    [System.Windows.Forms.MessageBox]::Show(
        "Timed out waiting for dev server. Try opening $AppUrl manually.",
        "Resume Builder", "OK", "Warning")
}

exit 0
