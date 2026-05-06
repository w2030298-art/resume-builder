<#
.SYNOPSIS
  Installs the Resume Builder shortcut into the Windows Start Menu.
.DESCRIPTION
  Creates a .lnk shortcut in %APPDATA%\Microsoft\Windows\Start Menu\Programs\
  that launches scripts\launch.ps1 via powershell.exe.
  Uses src\app\favicon.ico as the shortcut icon.
.NOTES
  Run once to install. Run uninstall-start-menu.ps1 to remove.
  Administrative privileges are NOT required (user-scoped Start Menu).
#>

$ErrorActionPreference = "Stop"
$ProjectRoot  = Resolve-Path "$PSScriptRoot\.." | Select-Object -ExpandProperty Path
$ShortcutName = "Resume Builder"
$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\$ShortcutName.lnk"
$LauncherPath = "$ProjectRoot\scripts\launch.ps1"
$IconPath     = "$ProjectRoot\src\app\favicon.ico"

# ── Validate prerequisites ─────────────────────────────────────
if (-not (Test-Path $LauncherPath)) {
    Write-Host "[ERROR] Launcher not found: $LauncherPath" -ForegroundColor Red
    exit 1
}

$iconArg = ""
if (Test-Path $IconPath) {
    $iconArg = ",0"
    Write-Host "[INFO] Icon: $IconPath" -ForegroundColor DarkGray
} else {
    Write-Host "[WARN] favicon.ico not found — shortcut will use default icon." -ForegroundColor Yellow
}

# ── Create shortcut ────────────────────────────────────────────
$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut($ShortcutPath)
$shortcut.TargetPath       = "powershell.exe"
$shortcut.Arguments        = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$LauncherPath`""
$shortcut.WorkingDirectory = $ProjectRoot
$shortcut.Description      = "Resume Builder — AI-powered bilingual resume builder"
if ($iconArg) {
    $shortcut.IconLocation  = "$IconPath$iconArg"
}
$shortcut.Save()

Write-Host "[OK] Start Menu shortcut created!" -ForegroundColor Green
Write-Host "     Location: $ShortcutPath" -ForegroundColor Green
Write-Host "     Press Win key and type 'Resume Builder' to find it." -ForegroundColor Green
