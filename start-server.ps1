# Redway Fire Protection — Local HTTP Server (Pure PowerShell)
# Run this script in PowerShell to launch a local server at http://localhost:3000/

$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "  Local Server running at http://localhost:$port/  " -ForegroundColor Green -BackgroundColor Black
    Write-Host "  Press Ctrl+C in this terminal to stop the server." -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Green
} catch {
    Write-Host "Error starting listener: $_" -ForegroundColor Red
    exit
}

# Keep serving files until stopped
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # Get local path
        $url = $request.Url.LocalPath
        if ($url -eq "/") { $url = "/index.html" }
        $url = $url.Replace('/', '\')
        
        # Resolve full path inside workspace root
        $path = Join-Path $PSScriptRoot $url

        if (Test-Path $path -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($path)
            
            # Set content-type based on file extension
            $extension = [System.IO.Path]::GetExtension($path).ToLower()
            $contentType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                default { "application/octet-stream" }
            }

            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # File not found
            $response.StatusCode = 404
            $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $url")
            $response.ContentType = "text/plain"
            $response.ContentLength64 = $msg.Length
            $response.OutputStream.Write($msg, 0, $msg.Length)
        }
        $response.Close()
    } catch {
        # Silent fail or minor error logging
    }
}
