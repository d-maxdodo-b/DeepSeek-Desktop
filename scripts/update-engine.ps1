param(
    [string]$EnginePath = "F:\00-engines\DEV-deepseek-harness"
)
$ErrorActionPreference = "Stop"
Write-Output "=== dsh 引擎自更新 (官方升级) ==="
if (-not (Test-Path (Join-Path $EnginePath "package.json"))) {
    Write-Error "引擎不存在: $EnginePath"
    exit 1
}
Set-Location $EnginePath

Write-Output "1/5 备份当前版本..."
$bak = Join-Path $EnginePath "..\dsh-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item -Path "$EnginePath\package.json" -Destination "$bak.package.json"
Copy-Item -Path "$EnginePath\pnpm-lock.yaml" -Destination "$bak.lock.yaml" -ErrorAction SilentlyContinue
Write-Output "   备份: $bak"

Write-Output "2/5 拉取官方更新..."
git pull --ff-only 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Warning "git pull 失败, 尝试 reset 后重试"
    git fetch origin 2>&1
    git reset --hard origin/main 2>&1
}

Write-Output "3/5 安装依赖..."
pnpm install 2>&1 | Select-Object -Last 3

Write-Output "4/5 构建..."
pnpm run build 2>&1 | Select-Object -Last 3

Write-Output "5/5 验证..."
pnpm dsh --version 2>&1 | Select-Object -Last 2

Write-Output "=== 更新完成, 壳子重启后生效 ==="