# Rastros 1.0.1 — checkup e piano por mouse

## Piano
O jogador clica nas teclas do piano. Não há atalhos de letras do teclado de computador no guia.
As etiquetas mostram a nota musical em destaque e o identificador do desenho menor. O guia explica como consultar a partitura; não mostra a sequência nem contagem de acertos.
Frase fornecida pelo usuário: A4 – B4 – E5 – A4 – B4 – E5. Assets correspondentes: A2 – A3 – A6 – A2 – A3 – A6.
A partitura do computador e a validação compartilham frontend/src/data/piano.js. As alturas das notas no pentagrama foram ajustadas.
Os 15 WAVs do ZIP foram convertidos de PCM24 para PCM16, mantendo canais, taxa, número de amostras e afinação. Manifesto de hashes em PIANO-AUDIO-MANIFEST.json.
Tentativas incorretas não impedem uma nova sequência; uma solução inicia o encerramento uma única vez.

## Correções
- Crédito: Luana Meneghini.
- Cursor: arte mantida em pequenos PNGs como cursor nativo, sem camada SVG filtrada seguindo o mouse.
- Relógio: Escape e setas normalizados para eventos nativos JavaFX; cancelamento do arraste ao perder captura; proteção para dimensões inválidas.
- Áudio pixel art: transição 20 na entrada; música 26 após quatro segundos e em loop até sair da fase, preservando a atualização anterior.
- Memória: o teste completo anterior terminou com erro de falta de memória durante decodificação de imagem. Removido o preload de 15 imagens 4K do piano; estados pressionados usam recortes próprios. Estimativa de pixels RGBA desses estados cai de 720 MiB para 12.7 MiB, sem contar overhead do renderizador.
- Demais artes do catálogo têm derivados de até 1920 px. Originais preservados nos fontes. Gerador em tools/prepare-runtime-art.py (Pillow).
- Heap Java limitado a 768 MiB para antecipar coleta de memória. Isso não limita toda a memória nativa do processo.

## Testes
64 testes unitários passaram; build web e compilação Java concluídos.
O teste direcionado anterior confirmou relógio (reabertura, 60 ajustes rápidos, erro e acerto), sons das 15 teclas e foco. Os relatórios finais desta revisão acompanham docs.
O defeito gráfico que só aparece no monitor não pode ser declarado eliminado apenas com screenshots. O mecanismo de cursor foi substituído; ainda é importante conferir na máquina onde o rastro foi percebido.

## Rodar
Extraia o ZIP Windows inteiro e execute Rastros/Rastros.exe. Preserve app e runtime. Não precisa instalar Java/Node ou usar navegador.
A janela identifica Rastros — 1.0.1. Save: %LOCALAPPDATA%/Rastros/save. F11 alterna tela cheia.

## Fontes relevantes
PianoPuzzle.jsx, ContinuationApps.jsx, GameCursor.jsx, ClockPuzzle.jsx; data/piano.js, continuation.js e mediaAssets.js; endingSystem.js e audioSystem.js; estilos mediaRevision.css/worldUnified.css; Main.java; tools/package-windows.ps1; testes e derivados de arte/áudio.
Nenhum save pessoal foi incluído na distribuição. Entregas anteriores preservadas.

Validação final: PASS no fluxo completo do executável, incluindo solução do piano por eventos de clique, encerramento e créditos. PASS na reabertura em um segundo processo com progresso persistido. Relatórios: TESTE-CHECKUP-FINAL.txt e TESTE-CHECKUP-REABERTURA.txt.
