> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Alterações — Rastros / interface e Windows

Base React/JavaFX preservada, incluindo narrativa, assets e saves. Revisão de 29/09/2026.

## Alterados

- `README.md`
- `docs/CONTINUIDADE.md`
- `docs/GUIA-DA-ENTREGA.md`
- `docs/INVENTARIO-ASSETS.json`
- `frontend/index.html`
- `frontend/package-lock.json`
- `frontend/src/App.jsx`
- `frontend/src/components/Desktop.jsx`
- `frontend/src/components/MainMenu.jsx`
- `frontend/src/components/NotebookView.jsx`
- `frontend/src/components/NpcDialogueOverlay.jsx`
- `frontend/src/components/SceneView.jsx`
- `frontend/src/components/WindowFrame.jsx`
- `frontend/src/data/art.js`
- `frontend/src/styles/retro.css`
- `frontend/src/systems/narrativeSystem.js`
- `frontend/tests/systems.test.mjs`
- `frontend/tests/webview-smoke.js`
- `frontend/tools/portable.mjs`
- `frontend/tools/preview.mjs`
- `src/main/java/com/seuteam/chatgame/Main.java`
- `src/main/java/com/seuteam/chatgame/SmokeCheck.java`
- `src/main/resources/web/index.html`

## Criados

- `docs/ALTERACOES-RASTROS.md`
- `docs/DESIGN-RASTROS.md`
- `docs/TESTES-RASTROS.md`
- `docs/WINDOWS.md`
- `frontend/src/assets/gamejam/objetos/tela branca.png`
- `frontend/src/assets/gamejam/objetos/tela preta.png`
- `frontend/src/components/ObjectNotice.jsx`
- `frontend/src/components/RetroIcon.jsx`
- `frontend/src/hooks/useModalFocus.js`
- `frontend/src/systems/screenLayout.js`
- `src/main/java/com/seuteam/chatgame/Launcher.java`
- `tools/package-windows.ps1`

## Removidos

- `frontend/src/systems/screenProjection.js`

## Distribuição

Rastros-Windows.zip contém Rastros.exe, HTML local e runtime Java/JavaFX incluído. Não usa localhost. Rastros-revisao-visual.zip contém o código e documentação, sem caches, saves ou dependências instaladas. ZIPs históricos src.zip permanecem no workspace, mas não entram na distribuição. As 36 artes do inventário foram preservadas. Identificadores internos chatgame foram mantidos para compatibilidade; a marca visível é Rastros.
