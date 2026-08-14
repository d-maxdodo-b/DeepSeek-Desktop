param(
    [string]$EnginePath = "F:\00-engines\DEV-deepseek-harness",
    [int]$Port = 3080
)
if (-not (Test-Path (Join-Path $EnginePath "package.json"))) {
    Write-Error "引擎不存在: $EnginePath"
    exit 1
}
$job = Start-Job -ScriptBlock {
    param($p, $port)
    Set-Location $p
    pnpm dsh web 2>&1
} -ArgumentList $EnginePath
Write-Output "已启动 dsh web (后台), 等待健康检查..."
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        if ($r.StatusCode -eq 200) {
            Write-Output "健康检查通过: http://127.0.0.1:$Port (${i}s)"
            exit 0
        }
    } catch {}
}
Write-Error "健康检查超时 (30s)"
exit 1