# PowerShell script to start the API
# double-clicking may prompt for execution policy; run with right-click -> "Run with PowerShell" if needed

# kill any process listening on port 4000 (used by API)
Write-Host "Checking for process on port 4000..."
$port = 3000
$proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($proc) {
    Write-Host "Killing process $proc using port $port"
    Stop-Process -Id $proc -Force
} else {
    Write-Host "Port $port is free."
}

Write-Host "Installing dependencies..."
npm install

Write-Host "Starting API server (press Ctrl+C to stop)..."
npm start

Write-Host "Server stopped. Press any key to exit."
[void][System.Console]::ReadKey($true)
