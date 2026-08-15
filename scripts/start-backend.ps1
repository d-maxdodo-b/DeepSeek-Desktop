param(
    [string]$EnginePath = "F:\00-engines\DEV-deepseek-harness",
    [int]$Port = 3080
)
if (-not (Test-Path (Join-Path $EnginePath "package.json"))) {
    Write-Error "engine not found: $EnginePath"
    exit 1
}
try {
    $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
    if ($r.StatusCode -eq 200) {
        Write-Output "engine already healthy: http://127.0.0.1:$Port (reused)"
        exit 0
    }
} catch {}

$candidates = @(
    (Join-Path $EnginePath "apps\cli\lib\bin.js"),
    (Join-Path $HOME ".dsh\profiles\node_modules\@deepseek-ai\dsh\lib\bin.js")
)
$builtBin = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if ($builtBin) {
    Write-Output "built mode: node $builtBin web"
} else {
    Write-Output "source mode: pnpm dsh web"
}
$job = Start-Job -ScriptBlock {
    param($p, $port, $built)
    Set-Location $p
    if ($built) { node $built web 2>&1 } else { pnpm dsh web 2>&1 }
} -ArgumentList $EnginePath, $Port, $builtBin
Write-Output "dsh web started (background), waiting for health..."
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Seconds 1
    try {
        $r = Invoke-WebRequest -Uri "http://127.0.0.1:$Port" -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        if ($r.StatusCode -eq 200) {
            Write-Output "health OK: http://127.0.0.1:$Port (${i}s)"
            exit 0
        }
    } catch {}
}
Write-Error "health timeout (30s)"
exit 1