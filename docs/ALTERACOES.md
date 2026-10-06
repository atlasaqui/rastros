> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Alterações — três vagões / Murilo

Comparação com a base funcional anterior de `work/chatgame`, antes desta implementação. O projeto React/JavaFX foi mantido; não houve substituição integral por outra stack.

## Arquivos alterados

- `README.md`
- `docs/GUIA-DA-ENTREGA.md`
- `docs/TESTES.md`
- `frontend/package.json`
- `frontend/src/App.jsx`
- `frontend/src/ChatApp.jsx`
- `frontend/src/components/BootScreen.jsx`
- `frontend/src/components/ChatBubble.jsx`
- `frontend/src/components/ChoiceButton.jsx`
- `frontend/src/components/Desktop.jsx`
- `frontend/src/components/MainMenu.jsx`
- `frontend/src/components/NotebookView.jsx`
- `frontend/src/components/NpcDialogueOverlay.jsx`
- `frontend/src/components/SceneView.jsx`
- `frontend/src/components/apps/InvestigationApps.jsx`
- `frontend/src/data/contacts.js`
- `frontend/src/data/emails.js`
- `frontend/src/data/files.js`
- `frontend/src/data/flags.js`
- `frontend/src/data/npcs.js`
- `frontend/src/data/puzzles.js`
- `frontend/src/data/scenes.js`
- `frontend/src/main.jsx`
- `frontend/src/save/saveSystem.js`
- `frontend/src/styles/retro.css`
- `frontend/src/systems/puzzleSystem.js`
- `frontend/tests/systems.test.mjs`
- `src/main/java/com/seuteam/chatgame/Main.java`
- `src/main/java/com/seuteam/chatgame/SmokeCheck.java`
- `src/main/resources/web/index.html`

## Arquivos criados

- `docs/CONTINUIDADE.md`
- `docs/INVENTARIO-ASSETS.json`
- `docs/MATRIZ-ROTEIRO.md`
- `docs/PUZZLES-FUTUROS.md`
- `docs/ROTEIRO-FONTE.txt`
- `frontend/src/assets/gamejam/NPCs/npc cinco branco.png`
- `frontend/src/assets/gamejam/NPCs/npc cinco preto.png`
- `frontend/src/assets/gamejam/NPCs/npc dois branco.png`
- `frontend/src/assets/gamejam/NPCs/npc dois preto.png`
- `frontend/src/assets/gamejam/NPCs/npc oito branco.png`
- `frontend/src/assets/gamejam/NPCs/npc oito preto.png`
- `frontend/src/assets/gamejam/NPCs/npc quatro branco.png`
- `frontend/src/assets/gamejam/NPCs/npc quatro preto.png`
- `frontend/src/assets/gamejam/NPCs/npc seis branco.png`
- `frontend/src/assets/gamejam/NPCs/npc seis preto.png`
- `frontend/src/assets/gamejam/NPCs/npc sete branco.png`
- `frontend/src/assets/gamejam/NPCs/npc sete preto.png`
- `frontend/src/assets/gamejam/NPCs/npc três branco.png`
- `frontend/src/assets/gamejam/NPCs/npc três preto.png`
- `frontend/src/assets/gamejam/NPCs/npc um branco.png`
- `frontend/src/assets/gamejam/NPCs/npc um preto.png`
- `frontend/src/assets/gamejam/cenários/vagão branco.jpg`
- `frontend/src/assets/gamejam/cenários/vagão dois branco.jpg`
- `frontend/src/assets/gamejam/cenários/vagão dois preto.jpg`
- `frontend/src/assets/gamejam/cenários/vagão preto.jpg`
- `frontend/src/assets/gamejam/cenários/vagão três branco.jpg`
- `frontend/src/assets/gamejam/cenários/vagão três preto.jpg`
- `frontend/src/assets/gamejam/cenários/vagão um branco.jpg`
- `frontend/src/assets/gamejam/cenários/vagão um preto.jpg`
- `frontend/src/assets/gamejam/cenários/vagão-1 branco.jpg`
- `frontend/src/assets/gamejam/cenários/vagão-1 preto.jpg`
- `frontend/src/assets/gamejam/objetos/bloco de notas branco.png`
- `frontend/src/assets/gamejam/objetos/bloco de notas preto.png`
- `frontend/src/assets/gamejam/objetos/caneta branca.png`
- `frontend/src/assets/gamejam/objetos/caneta preta.png`
- `frontend/src/assets/gamejam/objetos/jornal amassado branco.png`
- `frontend/src/assets/gamejam/objetos/jornal amassado preto.png`
- `frontend/src/assets/gamejam/objetos/notebook branco.png`
- `frontend/src/assets/gamejam/objetos/notebook preto.png`
- `frontend/src/components/MultiTapPuzzle.jsx`
- `frontend/src/data/art.js`
- `frontend/src/systems/narrativeSystem.js`
- `frontend/src/systems/screenProjection.js`
- `frontend/tests/webview-smoke.js`
- `frontend/tools/preview.mjs`

## Arquivos removidos

Nenhum.

## Preservação e empacotamento

Os dois `src.zip` históricos e as artes antigas foram preservados por compatibilidade, mas não são usados pelo novo fluxo. Os 34 assets recebidos foram copiados sem alteração de imagem. O motor de chat, WindowFrame, bridge e estrutura Java foram reaproveitados. Alguns componentes auxiliares receberam somente formatação.

Não entram no ZIP dependências instaladas, target, cache de build, saves locais, logs temporários ou resultados de testes; os scripts de teste permanecem. O HTML de produção entra pronto em src/main/resources/web/index.html.
