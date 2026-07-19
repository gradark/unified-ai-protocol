# unified-ai-protocol installer (Windows wrapper).
# Usage: .\install.ps1 [-Uninstall]
param([switch]$Uninstall)
$installArgs = @()
if ($Uninstall) { $installArgs += '--uninstall' }
node "$PSScriptRoot\scripts\install.js" @installArgs
