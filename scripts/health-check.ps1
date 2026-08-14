param([int]$Port = 3080)
try { $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -TimeoutSec 3 -UseBasicParsing; Write-Output "OK ($($r.StatusCode))" } catch { Write-Output "FAIL: $($_.Exception.Message)"; exit 1 }

