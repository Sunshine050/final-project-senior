# PowerShell script to kill process using port 3000
$port = 3000
$process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

if ($process) {
    Write-Host "Found process using port $port: PID $process"
    $procInfo = Get-Process -Id $process -ErrorAction SilentlyContinue
    if ($procInfo) {
        Write-Host "Process: $($procInfo.ProcessName) (PID: $process)"
        Stop-Process -Id $process -Force
        Write-Host "✅ Process killed successfully"
    }
} else {
    Write-Host "No process found using port $port"
}

