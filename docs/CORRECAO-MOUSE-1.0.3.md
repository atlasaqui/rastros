# Rastros 1.0.3 — Piano por mouse

Extraia o ZIP inteiro em uma pasta nova e abra Rastros.exe. Preserve app e runtime ao lado dele. O save existente em %LOCALAPPDATA%/Rastros/save continua sendo usado.

Sequência: B4 – D5 – B4 – A4 – B4 – D5 – E5 – D5 – B4.

Cada clique registra uma nota. Não há acordes, exigência de segurar teclas, ritmo obrigatório ou prazo entre cliques. A conferência acontece somente após nove notas. Uma tentativa errada mostra “Algo não está certo” e começa uma nova tentativa; uma correta aciona a cena final. Não há contador de acertos parciais. As teclas mostram suas notas musicais.

Base preservada: 1.0.1 com o refrão aprovado. Esta entrega altera o tratamento dos cliques e a conferência do piano, além da identificação da versão no pacote. Os sons existentes foram preservados.

Arquivos de produção alterados nesta correção: frontend/src/components/PianoPuzzle.jsx; src/main/java/com/seuteam/chatgame/Main.java; tools/package-windows.ps1. Testes atualizados em frontend/tests, com teste específico piano-mouse-smoke.js. Build web regenerado em src/main/resources/web.

Validação: 68 testes automatizados passaram e o build web foi concluído. O teste específico do executável verifica cliques comuns do mouse, erro após nove notas, ausência de pistas parciais, pausa de 12 segundos entre notas, conclusão e gravação da flag final. O relatório acompanha o código-fonte em docs/TESTE-PIANO-MOUSE-1.0.3.txt.
