# Servidor local de "Revisión de carreras UNDEF".
# Sirve la página en http://localhost:8790 y ejecuta las revisiones con Claude Code,
# usando la suscripción de Claude de quien lo abre (sin API ni costo extra).
# Se abre con iniciar.bat. Para cerrarlo, cerrá esta ventana.

param([switch]$SinNavegador, [int]$Puerto = 8790)
$ErrorActionPreference = 'Stop'
$Raiz = $PSScriptRoot
$Trabajo = Join-Path $env:TEMP 'revision-undef'
New-Item -ItemType Directory -Force $Trabajo | Out-Null
$utf8 = New-Object Text.UTF8Encoding($false)

function Buscar-Claude {
  $c = Get-Command claude -ErrorAction SilentlyContinue
  if ($c) { return $c.Source }
  $local = Join-Path $env:USERPROFILE '.local\bin\claude.exe'
  if (Test-Path $local) { return $local }
  # Claude Code incluido en la app de escritorio de Claude
  $inc = Get-ChildItem (Join-Path $env:LOCALAPPDATA 'Claude-Data\*\claude-code\*\*\claude.exe') -ErrorAction SilentlyContinue |
    Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($inc) { return $inc.FullName }
  return $null
}

function Sesion-Iniciada($exe) {
  try {
    $s = (& $exe auth status 2>$null | Out-String) | ConvertFrom-Json
    return [bool]$s.loggedIn
  } catch { return $false }
}

Write-Host ''
Write-Host '  Revisión de carreras UNDEF - servidor local' -ForegroundColor Cyan
Write-Host '  ---------------------------------------------'
$Claude = Buscar-Claude
if (-not $Claude) {
  Write-Host '  No se encontró Claude Code. Instalá la app de escritorio de Claude (claude.ai/download)' -ForegroundColor Yellow
  Write-Host '  o Claude Code, y volvé a abrir iniciar.bat. Mientras tanto la página funciona en modo copiar y pegar.'
} else {
  Write-Host "  Claude Code: $Claude"
  if (-not (Sesion-Iniciada $Claude)) {
    Write-Host ''
    Write-Host '  Falta iniciar sesión con tu cuenta de Claude (se hace una sola vez).' -ForegroundColor Yellow
    Write-Host '  Se va a abrir el navegador: entrá con tu cuenta y autorizá el acceso.'
    Write-Host ''
    & $Claude auth login --claudeai
    if (Sesion-Iniciada $Claude) { Write-Host '  Sesión iniciada.' -ForegroundColor Green }
    else { Write-Host '  No se pudo iniciar sesión. La página funcionará en modo copiar y pegar.' -ForegroundColor Yellow }
  } else {
    Write-Host '  Sesión de Claude: iniciada (usa tu suscripción).' -ForegroundColor Green
  }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Puerto/")
try { $listener.Start() } catch {
  Write-Host "  No se pudo abrir el puerto $Puerto (¿ya hay otra ventana del servidor abierta?)." -ForegroundColor Red
  Read-Host '  Enter para salir'
  exit 1
}
Write-Host ''
Write-Host "  Página: http://localhost:$Puerto/  (dejá esta ventana abierta mientras la usás)" -ForegroundColor Green
if (-not $SinNavegador) { Start-Process "http://localhost:$Puerto/" }

$tipos = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8';
            '.md'='text/markdown; charset=utf-8'; '.pdf'='application/pdf'; '.json'='application/json; charset=utf-8' }
$proc = $null
$inicio = $null
$archivoSalida = Join-Path $Trabajo 'salida.json'
$archivoError = Join-Path $Trabajo 'error.txt'
$archivoPedido = Join-Path $Trabajo 'pedido.txt'

function Responder($ctx, [int]$codigo, [string]$texto, [string]$tipo = 'application/json; charset=utf-8') {
  $b = $utf8.GetBytes($texto)
  $ctx.Response.StatusCode = $codigo
  $ctx.Response.ContentType = $tipo
  $ctx.Response.Headers.Add('Cache-Control', 'no-store')
  $ctx.Response.OutputStream.Write($b, 0, $b.Length)
  $ctx.Response.Close()
}

$script:sesionOk = $false
function Estado-Json {
  # La sesión se vuelve a consultar solo mientras no esté iniciada (cada consulta tarda un poco)
  if ($Claude -and -not $script:sesionOk) { $script:sesionOk = Sesion-Iniciada $Claude }
  $sesion = $script:sesionOk
  $e = 'libre'; $seg = 0
  if ($proc) {
    $seg = [int]((Get-Date) - $inicio).TotalSeconds
    if ($proc.HasExited) { $e = 'listo' } else { $e = 'corriendo' }
  }
  return (@{ local = $true; claude = [bool]$Claude; sesion = $sesion; estado = $e; segundos = $seg } | ConvertTo-Json -Compress)
}

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $req = $ctx.Request
    $ruta = [Uri]::UnescapeDataString($req.Url.AbsolutePath.TrimStart('/'))

    if ($ruta.StartsWith('api/')) {
      # Solo pedidos de esta misma página (bloquea a otros sitios web)
      $hostOk = $req.Headers['Host'] -in @("localhost:$Puerto", "127.0.0.1:$Puerto")
      if (-not $hostOk -or $req.Headers['X-SA-UNDEF'] -ne '1' -or $req.HttpMethod -eq 'OPTIONS') { Responder $ctx 403 '{"error":"prohibido"}'; continue }

      switch ($ruta) {
        'api/estado' { Responder $ctx 200 (Estado-Json) }
        'api/revisar' {
          if ($req.HttpMethod -ne 'POST') { Responder $ctx 405 '{"error":"usar POST"}'; break }
          if (-not $Claude) { Responder $ctx 409 '{"error":"No se encontró Claude Code en esta computadora."}'; break }
          if ($proc -and -not $proc.HasExited) { Responder $ctx 409 '{"error":"Ya hay una revisión en curso."}'; break }
          $lector = New-Object IO.StreamReader($req.InputStream, $utf8)
          $pedido = $lector.ReadToEnd(); $lector.Close()
          [IO.File]::WriteAllText($archivoPedido, $pedido, $utf8)
          Remove-Item $archivoSalida, $archivoError -ErrorAction SilentlyContinue
          $argumentos = '-p --output-format stream-json --verbose --allowedTools "Read,Glob,Grep" --disallowedTools "Bash,Edit,Write,NotebookEdit,WebFetch,WebSearch,Task"'
          $proc = Start-Process -FilePath $Claude -ArgumentList $argumentos -WorkingDirectory $Raiz -NoNewWindow -PassThru `
            -RedirectStandardInput $archivoPedido -RedirectStandardOutput $archivoSalida -RedirectStandardError $archivoError
          $inicio = Get-Date
          Write-Host ("  [{0:HH:mm}] Revisión iniciada ({1:N0} caracteres)." -f $inicio, $pedido.Length)
          Responder $ctx 200 '{"ok":true}'
        }
        'api/resultado' {
          if (-not $proc -or -not $proc.HasExited) { Responder $ctx 409 '{"error":"No hay un resultado listo."}'; break }
          $salida = ''; if (Test-Path $archivoSalida) { $salida = [IO.File]::ReadAllText($archivoSalida, $utf8) }
          $err = ''; if (Test-Path $archivoError) { $err = [IO.File]::ReadAllText($archivoError, $utf8) }
          Write-Host ("  [{0:HH:mm}] Revisión terminada." -f (Get-Date))
          Responder $ctx 200 (@{ salida = $salida; error = $err; codigo = $proc.ExitCode } | ConvertTo-Json -Compress)
        }
        'api/progreso' {
          # Últimas líneas de la salida de Claude Code (stream-json), para mostrar qué está haciendo
          $cola = ''
          if (Test-Path $archivoSalida) {
            $fs = [IO.File]::Open($archivoSalida, 'Open', 'Read', 'ReadWrite')
            try {
              $largo = [Math]::Min($fs.Length, 60000)
              [void]$fs.Seek(-$largo, 'End')
              $buf = New-Object byte[] $largo
              [void]$fs.Read($buf, 0, $largo)
              $cola = $utf8.GetString($buf)
            } finally { $fs.Close() }
          }
          Responder $ctx 200 (@{ cola = $cola } | ConvertTo-Json -Compress)
        }
        'api/normativa' {
          # PDF de la carpeta, con el nombre que figura en normativa.json (si está)
          $nombres = @{}
          $nj = Join-Path $Raiz 'normativa.json'
          if (Test-Path $nj) { foreach ($n in ([IO.File]::ReadAllText($nj, $utf8) | ConvertFrom-Json)) { $nombres[$n.archivo] = $n.nombre } }
          $lista = @(Get-ChildItem $Raiz -Filter *.pdf | ForEach-Object {
            $nom = $_.BaseName; if ($nombres.ContainsKey($_.Name)) { $nom = $nombres[$_.Name] }
            @{ archivo = $_.Name; nombre = $nom }
          })
          Responder $ctx 200 (ConvertTo-Json -InputObject $lista -Compress)
        }
        'api/cancelar' {
          if ($proc -and -not $proc.HasExited) { & taskkill /PID $proc.Id /T /F | Out-Null; Write-Host '  Revisión cancelada.' }
          $proc = $null
          Responder $ctx 200 '{"ok":true}'
        }
        default { Responder $ctx 404 '{"error":"no existe"}' }
      }
      continue
    }

    # Archivos de la página (solo de esta carpeta)
    if (-not $ruta) { $ruta = 'index.html' }
    $f = [IO.Path]::GetFullPath((Join-Path $Raiz $ruta))
    if ($f.StartsWith($Raiz, [StringComparison]::OrdinalIgnoreCase) -and (Test-Path -LiteralPath $f -PathType Leaf)) {
      $b = [IO.File]::ReadAllBytes($f)
      $ext = [IO.Path]::GetExtension($f).ToLower()
      if ($tipos.ContainsKey($ext)) { $ctx.Response.ContentType = $tipos[$ext] }
      $ctx.Response.Headers.Add('Cache-Control', 'no-store')
      $ctx.Response.OutputStream.Write($b, 0, $b.Length)
      $ctx.Response.Close()
    } else { Responder $ctx 404 'No encontrado' 'text/plain; charset=utf-8' }
  } catch {
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    try { Responder $ctx 500 (@{ error = $_.Exception.Message } | ConvertTo-Json -Compress) } catch {}
  }
}
