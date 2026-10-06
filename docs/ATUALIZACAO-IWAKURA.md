> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Rastros — Iwakura OS (30/09/2026)

## Alterações

- Nome Iwakura OS no boot, login, desktop, barras e janelas. Mensagens usa Iwakura Messenger.
- Save do executável usa a ponte Java e um arquivo JSON, independentemente da quota/origem do localStorage do WebView. A interface espera a ponte antes de carregar o progresso.
- Gravação em arquivo temporário com flush, substituição atômica quando suportada e backup da última gravação válida. Uma falha de escrita é informada, sem confirmar um save inexistente.
- Arquivo principal: `%LOCALAPPDATA%/Rastros/save/progress.json`. Recuperação: `progress.backup.json`. Atualizar ou mover a pasta do jogo não muda esse destino.
- Saves v3 acessíveis no armazenamento antigo do WebView são importados se ainda não existir um save nativo. Progresso que a versão anterior não conseguiu gravar não pode ser recuperado.
- Os ícones não têm mais a placa branca do CSS. A renderização remove somente o fundo branco conectado às bordas do recorte, preservando as áreas brancas internas e os arquivos originais. Botões de janela mantêm sua superfície de botão.
- Glitch de 1,9 segundo: 18 faixas negras com entrada, deslocamentos, variação de espessura, linhas de varredura e saída progressiva. Animação por transform/opacity, sem repetição infinita. Preferência de movimento reduzido usa uma transição breve sem barras.
- A mudança para preto continua imediata no primeiro login correto. A narrativa e a senha provisória não foram alteradas.

## Instalação

Extraia todo o ZIP e execute `Rastros.exe`. Mantenha `app` e `runtime` ao lado dele. Não é necessário instalar Java ou iniciar servidor. O jogo continua se chamando Rastros; Iwakura OS é o sistema do notebook.

## Verificação

- `npm test`: 18 testes passaram, incluindo persistência nativa sem localStorage e erro de gravação.
- `npm run build` e compilação Java concluídos.
- `tools/SaveStoreCheck.java`: reabertura, rejeição de dados inválidos, recuperação de backup e falha de escrita.
- Executável Windows real: fluxo até 77E, diálogos, leitura, senhas, pensamentos, aplicações e quatro resoluções.
- Segundo processo do executável: retomada do arquivo nativo, desktop autenticado e flags preservadas, sem repetir boot/glitch ou exibir erro de save. Testes usam pasta isolada, sem modificar o save pessoal.
- Capturas de login, desktop e glitch conferidas no WebView real.

## Arquivos

Criados: `src/main/java/com/seuteam/chatgame/SaveStore.java`, `tools/SaveStoreCheck.java`, `frontend/src/systems/iconBackground.js`, este relatório.

Alterados: `Main.java`, `JavaBridge.java`; `frontend/src/main.jsx`, `App.jsx`, `ChatApp.jsx`, `save/saveSystem.js`, `data/osAssets.js`, `styles/os.css`; componentes `BootScreen`, `Desktop`, `NotebookView`, `WindowFrame`, `RetroIcon`, `GlitchTransition`; testes `systems.test.mjs`, `webview-smoke.js`; build `src/main/resources/web/index.html`.

Nenhum arquivo do projeto foi removido. Os ZIPs não incluem dependências de desenvolvimento, caches ou saves de teste.
