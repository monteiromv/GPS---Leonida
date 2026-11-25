$root = "C:\Users\Muriel Vitor\.gemini\antigravity\scratch\leonidaverse-gta6-map"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8765/")
$listener.Start()
Write-Host "Server listening at http://localhost:8765/"

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".webp" = "image/webp"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $reqPath = $ctx.Request.Url.AbsolutePath.TrimStart('/')
  if ([string]::IsNullOrEmpty($reqPath)) { $reqPath = "index.html" }
  $filePath = Join-Path $root ($reqPath -replace '/', '\')

  if (Test-Path $filePath -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $ctx.Response.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
    $bytes = [System.IO.File]::ReadAllBytes($filePath)
    $ctx.Response.ContentLength64 = $bytes.Length
    $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $ctx.Response.StatusCode = 404
  }
  $ctx.Response.OutputStream.Close()
}
