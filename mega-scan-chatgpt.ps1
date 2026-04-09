param(
  [string]$ProjectRoot = "C:\dev\aurea-finance",
  [string]$OutputDir = "C:\dev\aurea-finance\_chatgpt_scan",
  [int]$MaxFileKB = 180,
  [int]$MaxDumpFiles = 250
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$PSDefaultParameterValues['Out-File:Encoding'] = 'utf8'

function Write-Utf8File {
  param(
    [string]$Path,
    [string]$Content
  )
  $parent = Split-Path -Parent $Path
  if ($parent -and -not (Test-Path $parent)) {
    New-Item -ItemType Directory -Path $parent -Force | Out-Null
  }
  [System.IO.File]::WriteAllText($Path, $Content, [System.Text.UTF8Encoding]::new($false))
}

function Get-RelativePath {
  param(
    [string]$BasePath,
    [string]$TargetPath
  )
  $base = [System.IO.Path]::GetFullPath($BasePath)
  if (-not $base.EndsWith([System.IO.Path]::DirectorySeparatorChar)) {
    $base += [System.IO.Path]::DirectorySeparatorChar
  }
  $baseUri = [System.Uri]$base
  $targetUri = [System.Uri]([System.IO.Path]::GetFullPath($TargetPath))
  $relative = $baseUri.MakeRelativeUri($targetUri).ToString()
  return [System.Uri]::UnescapeDataString($relative).Replace('/', '\')
}

function Normalize-RelPath {
  param([string]$Path)
  return $Path.Replace('/', '\').TrimStart('.','\')
}

function Test-IsSecretLike {
  param([string]$FullPath, [string]$RelPath)

  $name = [System.IO.Path]::GetFileName($FullPath).ToLowerInvariant()
  $rel = $RelPath.ToLowerInvariant()

  $secretExact = @(
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    '.env.test',
    '.npmrc'
  )

  $secretSuffixes = @(
    '.pem', '.key', '.pfx', '.p12', '.jks', '.keystore', '.crt', '.cer'
  )

  if ($secretExact -contains $name) { return $true }
  foreach ($suffix in $secretSuffixes) {
    if ($name.EndsWith($suffix)) { return $true }
  }

  if ($name -match '^id_rsa(\.pub)?$') { return $true }
  if ($rel -match '(^|\\)\.git(\\|$)') { return $true }

  return $false
}

function Test-IsUsefulTextFile {
  param(
    [string]$FullPath,
    [string]$RelPath
  )

  $rel = $RelPath.ToLowerInvariant()
  $name = [System.IO.Path]::GetFileName($FullPath).ToLowerInvariant()
  $ext = [System.IO.Path]::GetExtension($FullPath).ToLowerInvariant()

  $excludedDirPatterns = @(
    '(^|\\)\.git(\\|$)',
    '(^|\\)node_modules(\\|$)',
    '(^|\\)\.next(\\|$)',
    '(^|\\)\.turbo(\\|$)',
    '(^|\\)\.vercel(\\|$)',
    '(^|\\)dist(\\|$)',
    '(^|\\)build(\\|$)',
    '(^|\\)coverage(\\|$)',
    '(^|\\)out(\\|$)',
    '(^|\\)tmp(\\|$)',
    '(^|\\)temp(\\|$)',
    '(^|\\)logs?(\\|$)',
    '(^|\\)\.cache(\\|$)',
    '(^|\\)storybook-static(\\|$)',
    '(^|\\)android\\build(\\|$)',
    '(^|\\)ios\\build(\\|$)'
  )

  foreach ($pattern in $excludedDirPatterns) {
    if ($rel -match $pattern) { return $false }
  }

  if (Test-IsSecretLike -FullPath $FullPath -RelPath $RelPath) { return $false }

  $allowedExtensions = @(
    '.ts','.tsx','.js','.jsx','.mjs','.cjs',
    '.json','.jsonc',
    '.md','.mdx','.txt',
    '.yml','.yaml',
    '.sql',
    '.css','.scss',
    '.html',
    '.graphql','.gql',
    '.sh','.ps1','.bat',
    '.toml','.ini'
  )

  $allowedSpecialNames = @(
    'dockerfile',
    'makefile',
    '.env.example',
    '.env.sample',
    '.env.template',
    'readme',
    'readme.md',
    'changelog.md',
    'license'
  )

  if ($allowedExtensions -contains $ext) { return $true }
  if ($allowedSpecialNames -contains $name) { return $true }

  return $false
}

function Get-RootPriority {
  param([string]$RelPath)

  $rel = $RelPath.ToLowerInvariant()

  $priorityNames = @(
    'package.json',
    'pnpm-lock.yaml',
    'package-lock.json',
    'yarn.lock',
    'bun.lockb',
    'bun.lock',
    'tsconfig.json',
    'tsconfig.base.json',
    'next.config.js',
    'next.config.mjs',
    'next.config.ts',
    'tailwind.config.js',
    'tailwind.config.ts',
    'postcss.config.js',
    'postcss.config.mjs',
    'eslint.config.js',
    'eslint.config.mjs',
    '.eslintrc',
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.prettierrc',
    '.prettierrc.json',
    'vitest.config.ts',
    'vitest.config.js',
    'jest.config.ts',
    'jest.config.js',
    'drizzle.config.ts',
    'drizzle.config.js',
    'dockerfile',
    'docker-compose.yml',
    'docker-compose.yaml',
    'readme.md',
    '.env.example',
    '.env.sample',
    '.env.template'
  )

  $i = [Array]::IndexOf($priorityNames, $rel)
  if ($i -ge 0) { return $i }

  return 9999
}

function Get-SourcePriority {
  param([string]$RelPath)

  $rel = $RelPath.ToLowerInvariant()

  $priorityPatterns = @(
    '^app\\api\\import\\analyze\\route\.(ts|tsx|js|jsx)$',
    '^services\\import\.service\.(ts|tsx|js|jsx)$',
    '^lib\\validation\.(ts|tsx|js|jsx)$',
    '^components\\onboarding\\onboarding-wizard\.(ts|tsx|js|jsx)$',
    '^components\\theme-provider\.(ts|tsx|js|jsx)$',
    '^components\\theme-toggle\.(ts|tsx|js|jsx)$',
    '^components\\app-shell\.(ts|tsx|js|jsx)$',
    '^components\\page-header\.(ts|tsx|js|jsx)$',
    '^components\\ui\\badge\.(ts|tsx|js|jsx)$',
    '^components\\ui\\button\.(ts|tsx|js|jsx)$',
    '^components\\ui\\card\.(ts|tsx|js|jsx)$',
    '^components\\ui\\input\.(ts|tsx|js|jsx)$',
    '^components\\ui\\label\.(ts|tsx|js|jsx)$',
    '^components\\ui\\select\.(ts|tsx|js|jsx)$',
    '^features\\import\\services\\inventory\.(ts|tsx|js|jsx)$',
    '^features\\import\\services\\stage-workbook\.(ts|tsx|js|jsx)$',
    '^app\\\(workspace\)\\import\\\[batchid\]\\page\.(ts|tsx|js|jsx)$',
    '^tests\\installments\.test\.(ts|tsx|js|jsx)$',
    '^types\\runtime-compat\.d\.ts$',
    '^scripts\\.*',
    '^db\\.*',
    '^sql\\.*',
    '^lib\\.*',
    '^services\\.*',
    '^features\\.*',
    '^components\\.*',
    '^app\\.*',
    '^tests\\.*'
  )

  for ($i = 0; $i -lt $priorityPatterns.Count; $i++) {
    if ($rel -match $priorityPatterns[$i]) {
      return $i
    }
  }

  return 9999
}

if (-not (Test-Path $ProjectRoot)) {
  throw "ProjectRoot não existe: $ProjectRoot"
}

$ProjectRoot = (Resolve-Path $ProjectRoot).Path

if (Test-Path $OutputDir) {
  Remove-Item -Recurse -Force $OutputDir
}
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

$scanStarted = Get-Date

$allFiles = Get-ChildItem -LiteralPath $ProjectRoot -Recurse -File -Force | ForEach-Object {
  $rel = Get-RelativePath -BasePath $ProjectRoot -TargetPath $_.FullName
  [PSCustomObject]@{
    FullName = $_.FullName
    RelPath = Normalize-RelPath $rel
    Length = $_.Length
    LastWriteTime = $_.LastWriteTime
  }
}

$usefulFiles = $allFiles | Where-Object {
  Test-IsUsefulTextFile -FullPath $_.FullName -RelPath $_.RelPath
}

$rootConfigs = $usefulFiles | Where-Object {
  $_.RelPath -notmatch '\\'
} | Sort-Object @{Expression={ Get-RootPriority $_.RelPath }}, RelPath

$sourceFiles = $usefulFiles | Where-Object {
  $_.RelPath -match '\\'
} | Sort-Object @{Expression={ Get-SourcePriority $_.RelPath }}, RelPath

$dumpCandidates = @()
$dumpCandidates += $rootConfigs
$dumpCandidates += $sourceFiles

$selected = New-Object System.Collections.Generic.List[object]
$skipped = New-Object System.Collections.Generic.List[object]

foreach ($file in $dumpCandidates) {
  $fileKB = [math]::Ceiling($file.Length / 1KB)

  if ($selected.Count -ge $MaxDumpFiles) {
    $skipped.Add([PSCustomObject]@{
      RelPath = $file.RelPath
      Reason = "max_dump_files"
      SizeKB = $fileKB
    })
    continue
  }

  if ($file.Length -gt ($MaxFileKB * 1KB)) {
    $skipped.Add([PSCustomObject]@{
      RelPath = $file.RelPath
      Reason = "too_large"
      SizeKB = $fileKB
    })
    continue
  }

  $selected.Add($file)
}

$packageJsonPath = Join-Path $ProjectRoot 'package.json'
$pkgSummary = New-Object System.Text.StringBuilder

if (Test-Path $packageJsonPath) {
  try {
    $pkg = Get-Content -LiteralPath $packageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

    [void]$pkgSummary.AppendLine("PACKAGE SUMMARY")
    [void]$pkgSummary.AppendLine("===============")
    [void]$pkgSummary.AppendLine("name: $($pkg.name)")
    [void]$pkgSummary.AppendLine("version: $($pkg.version)")
    [void]$pkgSummary.AppendLine("private: $($pkg.private)")
    [void]$pkgSummary.AppendLine("packageManager: $($pkg.packageManager)")
    [void]$pkgSummary.AppendLine("")

    [void]$pkgSummary.AppendLine("SCRIPTS")
    [void]$pkgSummary.AppendLine("-------")
    if ($pkg.scripts) {
      foreach ($prop in $pkg.scripts.PSObject.Properties | Sort-Object Name) {
        [void]$pkgSummary.AppendLine("$($prop.Name) = $($prop.Value)")
      }
    } else {
      [void]$pkgSummary.AppendLine("(none)")
    }
    [void]$pkgSummary.AppendLine("")

    [void]$pkgSummary.AppendLine("DEPENDENCIES")
    [void]$pkgSummary.AppendLine("------------")
    if ($pkg.dependencies) {
      foreach ($prop in $pkg.dependencies.PSObject.Properties | Sort-Object Name) {
        [void]$pkgSummary.AppendLine("$($prop.Name) = $($prop.Value)")
      }
    } else {
      [void]$pkgSummary.AppendLine("(none)")
    }
    [void]$pkgSummary.AppendLine("")

    [void]$pkgSummary.AppendLine("DEV DEPENDENCIES")
    [void]$pkgSummary.AppendLine("----------------")
    if ($pkg.devDependencies) {
      foreach ($prop in $pkg.devDependencies.PSObject.Properties | Sort-Object Name) {
        [void]$pkgSummary.AppendLine("$($prop.Name) = $($prop.Value)")
      }
    } else {
      [void]$pkgSummary.AppendLine("(none)")
    }
  }
  catch {
    [void]$pkgSummary.AppendLine("Falha ao parsear package.json: $($_.Exception.Message)")
  }
}
else {
  [void]$pkgSummary.AppendLine("package.json não encontrado.")
}

$gitSummary = New-Object System.Text.StringBuilder
$gitDir = Join-Path $ProjectRoot '.git'

[void]$gitSummary.AppendLine("GIT SUMMARY")
[void]$gitSummary.AppendLine("===========")

if (Test-Path $gitDir) {
  try {
    $branch = git -C $ProjectRoot rev-parse --abbrev-ref HEAD 2>$null
    $commit = git -C $ProjectRoot rev-parse HEAD 2>$null
    $status = git -C $ProjectRoot status --short 2>$null

    [void]$gitSummary.AppendLine("branch: $branch")
    [void]$gitSummary.AppendLine("commit: $commit")
    [void]$gitSummary.AppendLine("")
    [void]$gitSummary.AppendLine("status:")
    if ($status) {
      $status | ForEach-Object { [void]$gitSummary.AppendLine($_) }
    } else {
      [void]$gitSummary.AppendLine("(clean or unavailable)")
    }
  }
  catch {
    [void]$gitSummary.AppendLine("Falha ao coletar git summary: $($_.Exception.Message)")
  }
}
else {
  [void]$gitSummary.AppendLine(".git não encontrado.")
}

$treeSb = New-Object System.Text.StringBuilder
[void]$treeSb.AppendLine("USEFUL FILE TREE")
[void]$treeSb.AppendLine("================")
foreach ($file in $usefulFiles | Sort-Object RelPath) {
  $sizeKB = [math]::Round($file.Length / 1KB, 2)
  [void]$treeSb.AppendLine(("{0} [{1} KB]" -f $file.RelPath, $sizeKB))
}

$selectedSb = New-Object System.Text.StringBuilder
[void]$selectedSb.AppendLine("SELECTED FILE DUMP")
[void]$selectedSb.AppendLine("==================")
[void]$selectedSb.AppendLine("ProjectRoot: $ProjectRoot")
[void]$selectedSb.AppendLine("GeneratedAt: $(Get-Date -Format s)")
[void]$selectedSb.AppendLine("MaxFileKB: $MaxFileKB")
[void]$selectedSb.AppendLine("MaxDumpFiles: $MaxDumpFiles")
[void]$selectedSb.AppendLine("")

foreach ($file in $selected) {
  [void]$selectedSb.AppendLine("")
  [void]$selectedSb.AppendLine(("=" * 120))
  [void]$selectedSb.AppendLine("FILE: $($file.RelPath)")
  [void]$selectedSb.AppendLine("SIZE: $([math]::Round($file.Length / 1KB, 2)) KB")
  [void]$selectedSb.AppendLine(("=" * 120))
  [void]$selectedSb.AppendLine("")

  try {
    $content = Get-Content -LiteralPath $file.FullName -Raw -Encoding UTF8
  }
  catch {
    try {
      $content = Get-Content -LiteralPath $file.FullName -Raw
    }
    catch {
      $content = "[erro ao ler arquivo] $($_.Exception.Message)"
    }
  }

  [void]$selectedSb.AppendLine($content)
  [void]$selectedSb.AppendLine("")
}

$skippedSb = New-Object System.Text.StringBuilder
[void]$skippedSb.AppendLine("SKIPPED FILES")
[void]$skippedSb.AppendLine("=============")
foreach ($item in $skipped | Sort-Object Reason, RelPath) {
  [void]$skippedSb.AppendLine("$($item.RelPath) | reason=$($item.Reason) | sizeKB=$($item.SizeKB)")
}

$summarySb = New-Object System.Text.StringBuilder
[void]$summarySb.AppendLine("CHATGPT PROJECT SCAN SUMMARY")
[void]$summarySb.AppendLine("============================")
[void]$summarySb.AppendLine("ProjectRoot: $ProjectRoot")
[void]$summarySb.AppendLine("OutputDir: $OutputDir")
[void]$summarySb.AppendLine("StartedAt: $($scanStarted.ToString('s'))")
[void]$summarySb.AppendLine("FinishedAt: $((Get-Date).ToString('s'))")
[void]$summarySb.AppendLine("AllFiles: $($allFiles.Count)")
[void]$summarySb.AppendLine("UsefulFiles: $($usefulFiles.Count)")
[void]$summarySb.AppendLine("SelectedForDump: $($selected.Count)")
[void]$summarySb.AppendLine("Skipped: $($skipped.Count)")
[void]$summarySb.AppendLine("")
[void]$summarySb.AppendLine("What was excluded:")
[void]$summarySb.AppendLine("- generated/build folders")
[void]$summarySb.AppendLine("- dependency folders")
[void]$summarySb.AppendLine("- obvious secret-like files")
[void]$summarySb.AppendLine("- oversized files beyond MaxFileKB")
[void]$summarySb.AppendLine("")
[void]$summarySb.AppendLine("Generated files:")
[void]$summarySb.AppendLine("- 00-summary.txt")
[void]$summarySb.AppendLine("- 01-git-summary.txt")
[void]$summarySb.AppendLine("- 02-package-summary.txt")
[void]$summarySb.AppendLine("- 03-useful-file-tree.txt")
[void]$summarySb.AppendLine("- 04-selected-file-dump.txt")
[void]$summarySb.AppendLine("- 05-skipped-files.txt")

Write-Utf8File -Path (Join-Path $OutputDir '00-summary.txt') -Content $summarySb.ToString()
Write-Utf8File -Path (Join-Path $OutputDir '01-git-summary.txt') -Content $gitSummary.ToString()
Write-Utf8File -Path (Join-Path $OutputDir '02-package-summary.txt') -Content $pkgSummary.ToString()
Write-Utf8File -Path (Join-Path $OutputDir '03-useful-file-tree.txt') -Content $treeSb.ToString()
Write-Utf8File -Path (Join-Path $OutputDir '04-selected-file-dump.txt') -Content $selectedSb.ToString()
Write-Utf8File -Path (Join-Path $OutputDir '05-skipped-files.txt') -Content $skippedSb.ToString()

Write-Host ""
Write-Host "Scan concluído."
Write-Host "Saída em: $OutputDir"
Write-Host "Arquivos úteis encontrados: $($usefulFiles.Count)"
Write-Host "Arquivos incluídos no dump: $($selected.Count)"
Write-Host "Arquivos pulados: $($skipped.Count)"
Write-Host ""
Write-Host "Agora me envie, de preferência nesta ordem:"
Write-Host "1) 00-summary.txt"
Write-Host "2) 02-package-summary.txt"
Write-Host "3) 03-useful-file-tree.txt"
Write-Host "4) 04-selected-file-dump.txt"
Write-Host "5) 05-skipped-files.txt"
