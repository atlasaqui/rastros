# Rastros 1.0.1 — revisão do refrão do piano

Base: os ZIPs da versão 1.0.1 enviados pelo usuário. Não foram incorporadas otimizações da versão 1.0.2.

Frase 1: B4 – D5 – B4 – A4.
Frase 2 (resposta): B4 – D5 – E5 – D5 – B4.
Sequência completa: B4 – D5 – B4 – A4 – B4 – D5 – E5 – D5 – B4.
Teclas: A3 – A5 – A3 – A2 – A3 – A5 – A6 – A5 – A3.

Todas as notas já existem no piano. Não há transposição nem alteração de afinação. O jogador clica nas teclas desenhadas com o mouse. A partitura contém as nove notas e identifica as duas frases. É necessário tocar ambas em ordem para resolver; a primeira frase sozinha não encerra o puzzle.

Os 15 WAVs são idênticos aos da base. A partitura e o puzzle compartilham a definição das frases em frontend/src/data/piano.js. O espaçamento do pentagrama foi ajustado para nove notas. O guia não revela a sequência nem os acertos parciais. A validação permanece por ordem, sem novo requisito de ritmo.

Arquivos de produção alterados: frontend/src/data/piano.js, frontend/src/data/continuation.js e frontend/src/components/ContinuationApps.jsx. Três testes foram atualizados: piano-input.test.mjs, webview-smoke.js e checkup-smoke.js. Documentação do piano atualizada.

O mecanismo beginEnding e o roteiro do encerramento permanecem os da base. O schema do save não foi alterado. Jogos concluídos continuam concluídos.

68 testes unitários passaram. Instalação offline das dependências, build web, servidor de desenvolvimento (HTTP 200) e compilação Java/JavaFX conferidos. PASS no fluxo completo do executável, incluindo nove notas na partitura, primeira frase insuficiente, sequência completa por cliques e encerramento. PASS na reabertura do novo save e de um save concluído da versão 1.0.1. Relatórios: docs/TESTE-MELODIA-*.txt. O frontend do executável testado coincide por SHA-256 com o build final dos fontes.

Extraia o ZIP Windows inteiro e abra Rastros/Rastros.exe. Save em %LOCALAPPDATA%/Rastros/save. F11: tela cheia. A revisão mantém a versão interna 1.0.1 e é identificada pelo sufixo Melodia dos ZIPs.
