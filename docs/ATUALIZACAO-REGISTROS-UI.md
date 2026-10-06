# Rastros — registros do MSN, interface e controles

Esta atualização continua a base OS Retro. Não substitui a arquitetura, o roteiro, os cenários ou os assets do jogo.

## Mudanças

- O Iwakura Messenger mostra conversas completas, incluindo as falas de Murilo e anexos já registrados. Não existe campo de resposta, botão Enviar, indicador de digitação ou resposta nova.
- Clicar em Gerâncio, Priscila ou Tata registra a leitura daquele contato. As leituras persistem no save. Apenas abrir o aplicativo não marca um contato novo; selecionar um contato restaura a consulta desde o início do histórico.
- Fechar Mensagens não dispara a perseguição. O botão normal **Afastar-se**, depois das três leituras e dos desbloqueios anteriores, inicia a sequência já existente. O pensamento final foi preservado no começo dessa saída. Uma nova tentativa preserva os puzzles e as leituras; vencer impede uma nova perseguição ao retornar ao computador.
- Diálogos, pensamentos, inspeções, ações do cenário, acesso ao diário, pausa e controles do piano compartilham o degradê escuro e o marcador amarelo do objetivo. Os cartões mantêm o ponto e a linha de conexão. O papel e as argolas superiores da caderneta foram preservados.
- O Messenger recebeu acentos discretos desse padrão. O restante do Iwakura OS mantém sua biblioteca monocromática e sua aparência retro.
- O minigame reconhece o formato de teclas do JavaFX: eventos reais podem chegar com `key` e `code` vazios e apenas `keyCode` preenchido. WASD, setas, Escape e E têm normalização centralizada. O canvas recebe foco ao entrar e ao retomar; perda de foco limpa as teclas e pausa. Toques breves ficam registrados até o próximo quadro, evitando que desapareçam entre keydown e keyup.

## Executável

Extraia **a pasta inteira** do ZIP Windows e abra `Rastros.exe`. Mantenha `app` e `runtime` junto dele. Não é necessário navegador, localhost, Node ou Java instalado.

O progresso continua em `%LOCALAPPDATA%/Rastros/save/progress.json`, com backup. Não apague essa pasta para atualizar. Os ZIPs não incluem saves pessoais nem os saves dos testes.

## Arquivos e manutenção

A lista completa está em `docs/MANIFESTO-REGISTROS-UI.json`. Nenhum arquivo da base foi removido.

- `frontend/src/components/ContinuationApps.jsx`: apresentação do arquivo do Messenger e seleção de contatos.
- `frontend/src/systems/messengerSystem.js`: acesso ao histórico completo, sem posições de envio.
- `frontend/src/systems/continuationSystem.js`: leituras e condições para iniciar o confronto.
- `frontend/src/App.jsx`: saída normal do notebook, pensamento de saída e atalhos do mundo.
- `frontend/src/systems/thoughtSystem.js`: confirmar um pensamento não força mais a saída do MSN.
- `frontend/src/styles/worldUnified.css`: padrão visual compartilhado do mundo e acentos do Messenger.
- `frontend/src/systems/keyboardSystem.js`: normalização de teclas modernas e do JavaFX.
- `frontend/src/components/EscapeGame.jsx`: foco, teclas pressionadas, toques breves e limpeza na pausa.

Os textos canônicos continuam em `frontend/src/data/continuation.js`. Os assets originais não foram alterados nesta entrega. Placeholders anteriores de fotos da galeria e a melodia técnica provisória do piano continuam conforme a base.

## Validação

- 60 testes automatizados passaram.
- Servidor de desenvolvimento iniciou e respondeu HTTP 200.
- Build de produção e compilação Java concluídos.
- Diagnóstico de entrada real do Windows reproduziu `key: ""`, `code: ""`, `keyCode: 87`, com evento confiável e canvas focado. O diagnóstico está em `docs/DIAGNOSTICO-TECLADO-ANTES.txt`.
- A conferência manual de todas as oito teclas foi interrompida pelo usuário com Escape. Não considerar esse ensaio manual completo. O teste automatizado do formato legado no WebView é separado e não deve ser confundido com entrada física do Windows.
- Consulte os relatórios `TESTE-REGISTROS-*` para os resultados finais do fluxo, da persistência e da compatibilidade do teclado.

Para reproduzir a suíte: `npm test --prefix frontend`. Para compilar: `npm run build --prefix frontend` e `mvn -o compile`. Para gerar outro pacote Windows: `tools/package-windows.ps1` com uma pasta de saída nova.

Os scripts em `frontend/tests` são exclusivos de teste. `--smoke` usa `app/test-save`, separado do progresso do jogador. O cenário `keyboard-fixture.json` afasta artificialmente os obstáculos para medir entradas; não é utilizado em partidas normais nem distribuído como save inicial.

O pacote final passou no fluxo completo até os créditos e na reabertura do save em outro processo. O teste do teclado em formato legado também passou nas oito direções/comandos, incluindo toques breves, tecla mantida, soltura e pausa. Esse último ensaio automatizado usa eventos sintéticos no WebView.
