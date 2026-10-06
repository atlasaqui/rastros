# Rastros — ajustes de diálogo, pausa e piano

- Faixa amarela no topo dos diálogos e da pausa. Objetivos preservam o visual anterior.
- As 15 teclas exibem A1–A8 e B1–B7, identificadores usados na partitura do jogo.
- Removidos contador de acertos e aviso imediato de nota errada. O som e a animação das teclas continuam; a sequência completa resolve o puzzle.

## Executar
Extraia todo o ZIP Windows e abra Rastros/Rastros.exe. Mantenha app e runtime junto do executável. Não precisa de navegador, servidor, Java ou Node instalados.
O save continua em %LOCALAPPDATA%/Rastros/save. Não há migração de formato nesta atualização.

## Arquivos editados
- frontend/src/components/PianoPuzzle.jsx
- frontend/src/styles/mediaRevision.css
- frontend/src/styles/worldUnified.css
- frontend/tests/webview-smoke.js
- src/main/resources/web/index.html (build gerado)

## Validação
60 testes unitários passaram; build frontend e compilação Java concluídos.
O relatório do teste automatizado no executável acompanha os fontes em docs/TESTE-PIANO-UI.txt.
