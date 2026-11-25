$ErrorActionPreference = "Stop"

$root = $PSScriptRoot
$dist = Join-Path $root "dist"

Write-Host "==> Cleaning dist directory..."
if (Test-Path $dist) {
  Remove-Item $dist -Recurse -Force
}
New-Item -ItemType Directory -Path $dist | Out-Null

$prodFiles = @(
  "index.html",
  "styles.css",
  "app.js",
  "i18n.js",
  "map-data-pt.js",
  "favicon.svg",
  "logo-monteiromv.jpg",
  "map-poster.webp",
  "robots.txt",
  "sitemap.xml"
)

Write-Host "==> Copying production assets..."
foreach ($file in $prodFiles) {
  $src = Join-Path $root $file
  if (-not (Test-Path $src)) {
    throw "Missing required production file: $file"
  }
  Copy-Item $src (Join-Path $dist $file) -Force
}

Write-Host "==> Validating local asset references in dist/index.html..."
$html = Get-Content -Raw -Encoding UTF8 (Join-Path $dist "index.html")
$refs = [regex]::Matches($html, '(?:src|href)="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
foreach ($ref in $refs) {
  if ($ref -match '^(https?:|#|mailto:)') { continue }
  $cleanRef = ($ref -split '\?')[0]
  $target = Join-Path $dist ($cleanRef -replace '/', '\')
  if (-not (Test-Path $target)) {
    throw "Broken local reference in index.html: $ref"
  }
}

Write-Host "==> Validating JavaScript & JSON data..."
$dataJs = Get-Content -Raw -Encoding UTF8 (Join-Path $dist "map-data-pt.js")
if ($dataJs -notmatch '^window\.LEONIDA_MAP_DATA\s*=') {
  throw "Invalid map-data-pt.js header"
}
$appJs = Get-Content -Raw -Encoding UTF8 (Join-Path $dist "app.js")
if ($appJs.Length -lt 1000) {
  throw "app.js appears truncated"
}
$i18nJs = Get-Content -Raw -Encoding UTF8 (Join-Path $dist "i18n.js")
foreach ($lang in @("PT", "EN", "ES", "FR")) {
  if ($i18nJs -notmatch "\b$lang\s*:") {
    throw "Missing language '$lang' in i18n.js"
  }
}

Write-Host "==> Build Summary:"
Get-ChildItem $dist | Select-Object Name, Length | Format-Table -AutoSize
$totalKB = [Math]::Round(((Get-ChildItem $dist | Measure-Object -Property Length -Sum).Sum / 1KB), 2)
Write-Host "BUILD SUCCEEDED: $($prodFiles.Count) files in dist/ ($totalKB KB total)"
