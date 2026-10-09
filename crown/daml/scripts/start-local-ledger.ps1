$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$damlCli = 'C:\Users\Varma\AppData\Roaming\daml\bin\daml.cmd'

Push-Location $repoRoot
try {
    Write-Host 'Starting local DAML ledger for CROWN development...'
    & $damlCli start
    if ($LASTEXITCODE -ne 0) {
        throw "DAML start failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}
