<#
.SYNOPSIS
  Removes the Resume Builder shortcut from the Windows Start Menu.
#>

$ShortcutPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Resume Builder.lnk"

if (Test-Path $ShortcutPath) {
    Remove-Item $ShortcutPath -Force
    Write-Host "[OK] Removed: $ShortcutPath" -ForegroundColor Green
} else {
    Write-Host "[INFO] Shortcut not found — nothing to uninstall." -ForegroundColor Yellow
}
