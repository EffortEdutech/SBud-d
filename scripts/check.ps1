$ErrorActionPreference = "Stop"

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)]
    [string[]] $Command
  )

  & $Command[0] @($Command | Select-Object -Skip 1)

  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}

Invoke-Checked @("corepack", "pnpm", "install", "--frozen-lockfile")
Invoke-Checked @("corepack", "pnpm", "check")
