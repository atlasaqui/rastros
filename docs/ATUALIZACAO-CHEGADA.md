# Rastros — chegada ao Vagão 4 e tela cheia

## Mudanças
Depois da fuga e da transição para o Vagão 4: fade escuro, mãos ensanguentadas, tela preta com “...”, depois “Eu não queria isso. Eu nunca quis isso.”, retorno à exploração do vagão do piano.
Após resolver o piano: fade e conversa final entre Sombra e Murilo, incluindo “Não há recomeço sem ela”, seguida dos créditos. A música final permanece inteira.
A chegada tem progresso salvo e não repete ao retornar do computador. Saves da versão anterior em encerramento são convertidos para a nova linha temporal.
Tela cheia: F11 em qualquer tela do executável, ou botão na pausa. Esc continua sendo pausa; F11 volta à janela.

## Executar
Extraia o ZIP Windows inteiro e abra Rastros/Rastros.exe. Mantenha app e runtime ao lado do executável. Nenhum servidor ou instalação de Java/Node é necessário.
O save continua em %LOCALAPPDATA%/Rastros/save.

## Arquivos
Criados: frontend/src/components/ArrivalVision.jsx, frontend/src/components/FullscreenButton.jsx, frontend/tests/arrival-smoke.js e este guia.
Editados: App.jsx, EndingCinematic.jsx, PauseMenu.jsx, endingSystem.js, continuationSystem.js, saveSystem.js, ending.css; JavaBridge.java e Main.java; testes ending.test.mjs, review2026.test.mjs e webview-smoke.js. Build web regenerado.
Nenhum asset ou arquivo de progresso removido.

## Validação
61 testes unitários passaram; build web e compilação Java passaram.
Tela cheia nativa ativada e desativada pelo botão durante o teste do executável.
Teste dedicado de chegada/piano/final disponível em frontend/tests/arrival-smoke.js; usa uma cópia de ending-registros-fixture.json com ending=null, arrivalElapsed=0, pianoSolved=false e flags gameComplete/pianoEndingPending/endingReturnedToMenu/arrivalVisionSeen/redGlitchPending=false, no save isolado de testes.
O teste geral parou na tolerância de áudio de uma cena anterior: desvio de 153 ms para limite de 150 ms. Esse limite não foi relaxado. O fluxo alterado foi verificado separadamente no executável.

Teste dedicado PASS até créditos/retorno ao menu e reabertura do save em segundo processo PASS. Relatórios em docs/TESTE-CHEGADA.txt e docs/TESTE-CHEGADA-REABERTURA.txt.
