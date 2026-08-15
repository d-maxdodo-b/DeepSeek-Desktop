$ErrorActionPreference = "SilentlyContinue"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$exe = Join-Path $root "node_modules\electron\dist\electron.exe"
$out = Join-Path $env:TEMP "dsh-out.log"
$err = Join-Path $env:TEMP "dsh-err.log"
Start-Process -FilePath $exe -ArgumentList ". --disable-gpu" -WorkingDirectory $root -RedirectStandardOutput $out -RedirectStandardError $err
Write-Output "launched from $root"