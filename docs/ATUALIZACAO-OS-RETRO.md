# Rastros — revisão OS Retro sobre a versão .91

Esta atualização parte dos fontes dentro de `Rastros .91.zip`. Não substitui o jogo pelo protótipo antigo. A investigação completa, as cinco etapas da fuga, o piano, os áudios e o encerramento foram preservados.

## O que mudou
- Objetivo e localização: cartões escuros em degradê com marca lateral amarelo discreto (#d4b653). A localização continua separada do objetivo, sem revelar onde encontrar pistas.
- Marcadores de NPCs, objetos e portas, balões e diálogos aprovados foram mantidos.
- Nenhum botão Menu flutuante. Esc abre a pausa na exploração, computador e perseguição. Em inspeções, diálogos e pop-ups, Esc fecha primeiro a interação atual; depois abre a pausa. O computador conserva o botão Afastar-se.
- Pausa: continuar, volume, silêncio, retorno confirmado ao menu e Encerrar jogo confirmado no executável. Durante a fuga, a pausa continua congelando a simulação.
- Iwakura OS inteiramente preto e branco: login Pedrosa, desktop, janelas, menus, explorador, arquivos, documentos, galeria, memória, e-mail e Messenger.
- Novos ícones e avatares extraídos em tempo de desenho das pranchas fornecidas. Fundo magenta transparente; branco interno preservado. Duplicatas, divisórias e legendas não entram nos recortes. O login usa a figura genérica de usuário.
- Avatares: Murilo, Gerâncio, Priscila e Renata/Tata nas posições especificadas. Textos, botões, senha e mensagens continuam funcionais; a tela não é uma imagem achatada.

## Desempenho e save
O arquivo HTML inicial original tinha 71.878.371 bytes. Os assets agora são arquivos locais separados em `app/web/assets`, mantendo carregamento offline no executável. As imagens não perderam resolução e as fontes continuam incluindo os originais.

Foi removida a decodificação antecipada de todas as artes/cenários na abertura. O jogo prepara apenas o cenário atual; outros assets são carregados quando utilizados.

Ponteiros e campos do relógio usam estado local. Movimentos consecutivos não atualizam o jogo inteiro nem gravam em disco. Há gravação após 500 ms de repouso, ao soltar o ponteiro, sair do campo, confirmar ou sair da inspeção. Fechar o executável também solicita a gravação do ajuste pendente. A solução permanece 00:14 e exige confirmação. Arrastar janelas também só confirma a posição ao soltar.

Formato e localização do save permanecem compatíveis: `%LOCALAPPDATA%/Rastros/save`, com backup. Não apagamos nem substituímos o save do jogador pelos testes, que usam uma pasta isolada.

## Organização dos arquivos
- `frontend/src/data/osAssets.js`: catálogo e coordenadas dos recortes.
- `frontend/src/components/RetroIcon.jsx` e `systems/retroPixels.js`: desenho, transparência magenta e preservação do branco.
- `frontend/src/styles/iwakuraMono.css`: paleta do OS e ajustes restritos aos dois indicadores de exploração.
- `frontend/src/components/ClockPuzzle.jsx` e `systems/clockDraft.js`: ajuste local e confirmação do relógio.
- `frontend/src/components/PauseMenu.jsx`: opções e confirmação da pausa.
- `frontend/tools/portable.mjs`: build com arquivos externos locais.
- `tools/package-windows.ps1`: empacotamento com Java integrado.
- `docs/MANIFESTO-OS-RETRO.json`: arquivos alterados/criados/removidos em relação à .91.
- `docs/OS-Retro-originais`: as nove referências recebidas, sem alterações.

Os controles e campos foram construídos em código seguindo as pranchas de componentes e login. As duas pranchas de controles duplicadas e a prancha de arquivos com legendas são referências alternativas; não são telas inteiras sobrepostas à interface.

## Limites preservados da versão .91
A sequência técnica do puzzle do piano permanece provisória. Não inventamos uma nova melodia nem alteramos falas do roteiro. Os espaços de fotos da galeria continuam identificados como provisórios no conteúdo original, aguardando imagens definitivas. A partitura existente e sua função na progressão continuam disponíveis.

## Executar
Extraia a pasta inteira do ZIP Windows e abra `Rastros.exe`. Não precisa instalar Java/Node nem abrir site ou localhost. Mantenha as pastas `app` e `runtime` junto do executável.

Os relatórios de testes desta revisão usam o prefixo `TESTE-OS-RETRO`. Os relatórios anteriores mantidos nos fontes são históricos.

## Validação concluída

- Instalação das dependências, servidor de desenvolvimento, build de produção e compilação Java concluídos.
- 58 testes de lógica aprovados.
- Percurso completo no executável empacotado, do Novo jogo aos créditos, com áudio e checkpoints.
- Reabertura em um segundo processo: final, relógio, memória, tentativa da fuga e diário preservados.
- Relógio: 60 alterações consecutivas em 113 ms no ensaio desta máquina, incluindo a espera de verificação; nenhuma gravação por alteração. Isto não é uma promessa de FPS para todo hardware.
- Ajuste pendente 02:37 gravado pelo fluxo de fechamento antes dos 500 ms e recuperado em outro processo, sem resolver o puzzle indevidamente.
- Oito ícones conferidos no WebView: pixels pretos/brancos e transparência presentes, preservando branco interno.
- Relógio, Messenger, piano e créditos verificados em 1280×720, 1366×768, 1920×1080 e 820×900.
- HTML de produção: aproximadamente 366 KB, em vez de 71,9 MB; as imagens permanecem separadas no pacote.

Capturas em `docs/capturas-os-retro`. Testes não utilizaram o save real do usuário.
