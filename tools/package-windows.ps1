param(
    [string]$OutputDirectory,
    [string]$JdkRoot,
    [string]$MavenRepository = (Join-Path $env:USERPROFILE '.m2/repository')
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
if (-not $JdkRoot) { $JdkRoot = Split-Path (Split-Path (Get-Command java.exe).Source -Parent) -Parent }
if (-not $OutputDirectory) { $OutputDirectory = Join-Path $projectRoot ('dist/windows-' + (Get-Date -Format 'yyyyMMdd-HHmmss')) }
$OutputDirectory = [IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $OutputDirectory) { throw "Use uma pasta de saída nova: $OutputDirectory" }
foreach ($toolName in @('jar.exe','jlink.exe','jpackage.exe')) {
    if (-not (Test-Path -LiteralPath (Join-Path $JdkRoot "bin/$toolName"))) { throw "JDK completo necessário: $toolName" }
}
function Check-Result { if ($LASTEXITCODE -ne 0) { throw "Comando falhou com código $LASTEXITCODE" } }
Push-Location (Join-Path $projectRoot 'frontend')
try { & npm.cmd run build; Check-Result } finally { Pop-Location }
Push-Location $projectRoot
try { & mvn.cmd -o compile; Check-Result } finally { Pop-Location }
[xml]$projectPom = Get-Content -LiteralPath (Join-Path $projectRoot 'pom.xml')
$fxVersion = $projectPom.project.properties.'javafx.version'
$moduleJars = @('base','graphics','controls','media','web') | ForEach-Object {
    $moduleJar = Join-Path $MavenRepository "org/openjfx/javafx-$_/$fxVersion/javafx-$_-$fxVersion-win.jar"
    if (-not (Test-Path -LiteralPath $moduleJar)) { throw "Dependência ausente: $moduleJar. Execute mvn compile antes." }
    $moduleJar
}
$gsonJar = Join-Path $MavenRepository 'com/google/code/gson/gson/2.11.0/gson-2.11.0.jar'
if (-not (Test-Path -LiteralPath $gsonJar)) { throw 'Gson 2.11.0 ausente no cache Maven.' }
$stageDirectory = Join-Path $OutputDirectory 'input'
$runtimeDirectory = Join-Path $OutputDirectory 'runtime'
$appDirectory = Join-Path $OutputDirectory 'app-image'
New-Item -ItemType Directory -Path $stageDirectory,(Join-Path $stageDirectory 'web'),(Join-Path $stageDirectory 'tests') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $projectRoot 'src/main/resources/web/index.html') -Destination (Join-Path $stageDirectory 'web/index.html')
Copy-Item -LiteralPath (Join-Path $projectRoot 'src/main/resources/web/assets') -Destination (Join-Path $stageDirectory 'web/assets') -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot 'src/main/resources/web/media') -Destination (Join-Path $stageDirectory 'web/media') -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot 'src/main/resources/audio/runtime') -Destination (Join-Path $stageDirectory 'audio') -Recurse
Copy-Item -LiteralPath (Join-Path $projectRoot 'frontend/tests/webview-smoke.js') -Destination (Join-Path $stageDirectory 'tests/webview-smoke.js')
Copy-Item -LiteralPath $gsonJar -Destination (Join-Path $stageDirectory 'gson.jar')
$manifestPath = Join-Path $OutputDirectory 'MANIFEST.MF'
[IO.File]::WriteAllText($manifestPath, "Manifest-Version: 1.0`nMain-Class: com.seuteam.chatgame.Launcher`nClass-Path: gson.jar`n`n", [Text.Encoding]::ASCII)
& (Join-Path $JdkRoot 'bin/jar.exe') --create --file (Join-Path $stageDirectory 'rastros.jar') --manifest $manifestPath -C (Join-Path $projectRoot 'target/classes') com -C (Join-Path $projectRoot 'target/classes') audio/clock.wav
Check-Result
$modulePath = (@((Join-Path $JdkRoot 'jmods')) + $moduleJars) -join ';'
& (Join-Path $JdkRoot 'bin/jlink.exe') --module-path $modulePath --add-modules java.se,jdk.unsupported,jdk.crypto.ec,javafx.controls,javafx.web --output $runtimeDirectory --strip-debug --no-header-files --no-man-pages --compress=2
Check-Result
& (Join-Path $JdkRoot 'bin/jpackage.exe') --type app-image --name Rastros --app-version 1.0.3 --input $stageDirectory --main-jar rastros.jar --main-class com.seuteam.chatgame.Launcher --runtime-image $runtimeDirectory --dest $appDirectory --java-options '-Xms64m' --java-options '-Xmx768m' --java-options '-Drastros.packaged=true' --java-options '--add-modules=javafx.controls,javafx.web' --description 'Rastros'
Check-Result
$result = Join-Path $appDirectory 'Rastros'
[IO.File]::WriteAllText((Join-Path $result 'LEIA-ME.txt'), "RASTROS`r`n`r`nExtraia a pasta inteira e abra Rastros.exe.`r`nNão é necessário instalar Java, Node, abrir navegador ou iniciar servidor.`r`nMantenha as pastas app e runtime junto do executável.`r`nProgresso salvo em %LOCALAPPDATA%\Rastros\save.`r`nMouse ou Tab + Enter para interagir. E: notebook. Esc: pausa.`r`nPerseguição: WASD ou setas, suba por cinco vagões. Esc: pausa, volume e retorno confirmado. Partitura disponível no computador.`r`n", [Text.Encoding]::UTF8)
Write-Output "WINDOWS_APP=$result"
