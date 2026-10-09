$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$damlCli = 'C:\Users\Varma\AppData\Roaming\daml\bin\daml.cmd'

Push-Location $repoRoot
try {
    Write-Host 'Building CROWN DAML package...'
    & $damlCli build
    if ($LASTEXITCODE -ne 0) {
        throw "DAML build failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}
