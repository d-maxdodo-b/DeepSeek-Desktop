param([int]$Port = 3080)
$conn = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if ($conn) { $conn | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }; Write-Output "已停止端口 $Port 进程" } else { Write-Output "端口 $Port 无监听" }

