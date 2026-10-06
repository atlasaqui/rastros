> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Rastros — identidade e interface

Atualização de 29/09/2026 sobre a base dos três vagões. React, JavaFX, conteúdo narrativo, identificadores e formato do save foram preservados. Esta entrega termina em 77E, sem continuação inventada.

## Direção visual

O menu usa a arte original do primeiro vagão com título serifado, fundo em carvão, tons de papel e ações numeradas. O contraste e a hierarquia criam a atmosfera de investigação; não foram acrescentados monstros, sangue ou slogans narrativos. Diálogos usam serifas legíveis, com pensamentos em itálico e identificação explícita. Controles físicos são discretos e angulares.

O computador mantém a linguagem de um SO dos anos 2000: superfície cinza, barras azuis, bordas ressaltadas, ícones locais e aplicações em janelas. Os ícones do desktop foram desenhados como SVGs em `RetroIcon.jsx`, sem dependência de emojis, imagens externas ou bibliotecas adicionais.

Não havia uma skill específica de UI/UX disponível nesta sessão. A revisão foi realizada diretamente sobre a interface existente, com inspeção visual e testes de interação. Nenhuma skill de design não disponível foi alegada ou instalada.

## Telas frontais

As imagens `tela branca.png` e `tela preta.png` foram copiadas sem alteração para `frontend/src/assets/gamejam/objetos/`. Ambas mantêm 3840 × 2160 e seu canal alfa original. O interior do LCD é opaco: a interface é uma camada real sobre essa área, e não uma imagem do desktop.

`data/art.js` registra as imagens em `ART.notebookScreen`. O registro antigo `ART.notebook` continua disponível para o objeto físico; o notebook presente nos cenários não foi substituído nem duplicado.

`systems/screenLayout.js` centraliza o retângulo seguro do LCD, em percentuais do canvas completo:

| Propriedade | Valor |
|---|---:|
| Esquerda | 12,1% |
| Topo | 12,8% |
| Largura | 77,2% |
| Altura | 75,8% |

Esse retângulo fica dentro dos traços das duas artes. O contêiner preserva 16:9 e ocupa até 107,5% da largura da viewport (somente margens transparentes ultrapassam a tela), limitado à altura disponível menos 12 px. Afastar-se fica abaixo da área do LCD. O SO se adapta ao espaço disponível sem transformar, inclinar ou esticar textos. A antiga projeção afim e os estilos de carcaça/teclado artificiais foram removidos.

## Variante narrativa

`NotebookView` chama `sceneVariant(save)`, a mesma fonte usada pelos cenários. O primeiro login correto arma a transformação, mas o close permanece branco nessa sessão. Ao sair, `leaveNotebook()` aplica a transformação prevista; ao reabrir, a tela é preta. Boot e tentativas erradas não transformam o cenário. O SO permanece legível e não recebe inversão global de cor.

## Pontos de ajuste

| Área | Arquivo a partir de frontend/src |
|---|---|
| Menu e confirmação de novo jogo | `components/MainMenu.jsx` |
| Tokens de cor, fonte e ritmo; mundo e SO | `styles/retro.css` |
| Arte e composição frontal | `components/NotebookView.jsx`, `data/art.js` |
| Retângulo LCD e limites das janelas | `systems/screenLayout.js` |
| Drag, maximização e foco de janelas | `components/WindowFrame.jsx` |
| Ícones vetoriais locais | `components/RetroIcon.jsx` |
| Diálogos e inspeção | `components/NpcDialogueOverlay.jsx`, `components/ObjectNotice.jsx` |
| Contenção/restauração de foco de modal | `hooks/useModalFocus.js` |
| Tempos de transição | `App.jsx` e regras correspondentes em `retro.css` |

Os tokens `--world-*` são do mundo físico; `--os-*` são digitais. As transições do notebook duram 260 ms; movimento reduzido remove a espera. A transição entre vagões mantém o ritmo anterior.

## Saves e janelas

A chave `chatgame_murilo_v3`, os pacotes Java e a pasta de armazenamento JavaFX foram mantidos. A troca de nome não cria um save vazio. Não houve migração de esquema. Saves do mesmo navegador/origem continuam válidos; trocar a porta ou usar JavaFX é outro armazenamento, como antes.

Janelas antigas são limitadas ao espaço útil na renderização e durante o arrasto, considerando a barra inferior de 32 px. A posição visual se adapta também ao redimensionamento. Maximização, minimização, conteúdo e notas permanecem salvos.

Novo jogo tem confirmação no próprio menu; cancelar ou pressionar Escape mantém o progresso. Os modais contêm a navegação por Tab e tentam restaurar o foco no controle que os abriu.

## Conteúdo preservado e pendências

Login: 04/06/2000. FIXO continua preparado para uma etapa futura, sem substituir o login. Pasta 77E reconhece a resposta, mas não abre conteúdo ainda não escrito. Contatos e e-mails não receberam mensagens inventadas.

Permanecem as decisões de arte documentadas no guia: representação dos casais, jornal sobre a mesa e Vagão 1 branco ao revisitar. As artes e pistas dos puzzles futuros continuam pendentes. Os dois novos PNGs são os assets fornecidos para esta apresentação, não placeholders gerados.

A entrega inclui código-fonte e uma distribuição portátil Windows separada, com Rastros.exe e runtime próprio. Não depende de servidor nem de instalação de Java. Execução e reconstrução estão no README e em WINDOWS.md.

## Ajuste solicitado na revisão

O notebook foi ampliado e o fundo opaco foi removido. Durante o close, o cenário do vagão atual preenche a viewport com object-fit: cover; ao sair, a exploração volta ao canvas contido com hotspots alinhados. O fundo usa o mesmo asset e a mesma variante narrativa do vagão, com escurecimento leve. Na instrução seguinte, o usuário pediu o executável junto da próxima entrega de arquivos; a distribuição Windows foi incluída nessa entrega.

## Revisão final do texto da interface

Removidos os textos GAME JAM LITERÁRIA e INVESTIGAÇÃO / TERROR PSICOLÓGICO do topo do menu. Os objetivos associados à investigação do computador agora dizem “Investigue o computador.”, sem indicar diretamente o arquivo ou a senha. A narrativa não foi alterada.
