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

function Assert-NoTrackedSecretFiles {
  $trackedFiles = & git ls-files

  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }

  $blocked = $trackedFiles | Where-Object {
    $name = Split-Path -Leaf $_
    ($name -match '^\.env(\..*)?$' -and $name -ne '.env.example') -or
    ($name -match '(?i)(service[_-]?role|private[_-]?key|secret|token)\.(json|txt|pem|key)$')
  }

  if ($blocked) {
    Write-Error "Tracked secret-like file(s) detected. Remove them before release."
  }
}

function Assert-RequiredMigrationsExist {
  $requiredMigrations = @(
    "database/supabase/migrations/20260711144311_create_student_profiles.sql",
    "database/supabase/migrations/20260712062032_create_academic_profile.sql",
    "database/supabase/migrations/20260712071000_create_learning_documents.sql",
    "database/supabase/migrations/20260712082000_create_plkg_foundation.sql",
    "database/supabase/migrations/20260713073000_create_study_preparation_revision.sql",
    "database/supabase/migrations/20260713091000_create_sync_queue_events.sql"
  )

  $missing = $requiredMigrations | Where-Object { -not (Test-Path -LiteralPath $_) }

  if ($missing) {
    Write-Error "Required migration file(s) missing: $($missing -join ', ')"
  }
}

Invoke-Checked @("corepack", "pnpm", "install", "--frozen-lockfile")
Invoke-Checked @("corepack", "pnpm", "build")
Invoke-Checked @("corepack", "pnpm", "check")
Assert-NoTrackedSecretFiles
Assert-RequiredMigrationsExist

Write-Output "MVP readiness checks passed."
