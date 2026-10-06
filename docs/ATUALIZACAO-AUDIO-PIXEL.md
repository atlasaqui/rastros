# Rastros — áudio da fase pixel art

A transição 20 enviada toca na entrada da fuga. A música 26 enviada começa quatro segundos depois e repete enquanto o jogador permanece na fase. Ao terminar ou sair, o áudio da fase é interrompido. Em nova tentativa a transição é reapresentada.
O áudio da cortina anterior foi preservado separadamente; a música 26 não começa mais naquela cena.
A música recebida em PCM 24 bits foi convertida para PCM 16 bits estéreo/44,1 kHz para compatibilidade com o executável, sem cortes e com duração de 102,5 segundos.

Testes: 61 unitários passaram; build web e Java passaram. No executável, intervalo medido de 4019 ms; loop nativo conferido buscando o final da faixa; conclusão dos cinco vagões interrompe a faixa e inicia estágio 5. Relatório em docs/TESTE-AUDIO-PIXEL.txt.

Extraia o ZIP Windows inteiro e abra Rastros/Rastros.exe. Mantenha app e runtime juntos. Save em %LOCALAPPDATA%/Rastros/save preservado.

Arquivos: App.jsx, EscapeGame.jsx, audioSystem.js, audioCues.js, audioCatalog.js; áudio runtime/26.wav e glitch-3-4.wav substituídos; curtain-transition.wav criado para preservar a cena anterior. Build web regenerado. Teste dedicado em frontend/tests/pixel-audio-smoke.js, iniciado com save isolado em resumeMode=chase.
