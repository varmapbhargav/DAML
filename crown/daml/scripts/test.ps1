$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$damlCli = 'C:\Users\Varma\AppData\Roaming\daml\bin\daml.cmd'

Push-Location $repoRoot
try {
    Write-Host 'Running DAML scripts and tests...'
    & $damlCli test
    if ($LASTEXITCODE -ne 0) {
        throw "DAML tests failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}
