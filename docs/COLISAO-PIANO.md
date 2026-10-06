# Assentos e áudio do piano

Colisão para o jogador nos dez bancos laterais da arte, nas coordenadas do canvas 360x640. Movimento por eixos mantém deslocamento ao longo dos obstáculos. Posições antigas dentro de bancos voltam ao corredor ao retomar. A mão e o vulto mantêm o comportamento anterior.

O piano para os sons anteriores ao abrir. Sons de interface ficam desativados dentro dele; somente as teclas são tocadas. Fechar sem concluir permite retomar o ambiente. A sequência correta ainda inicia a cena final com a música existente. Sem limite de tempo entre notas.

Alterados: frontend/src/systems/escapeSystem.js, frontend/src/components/PianoPuzzle.jsx, frontend/src/systems/audioSystem.js, frontend/src/App.jsx. Testes atualizados em frontend/tests/review2026.test.mjs e novo piano-silence-smoke.js. Build web regenerado.

69 testes passaram, incluindo os cinco vagões vencíveis, bloqueio em todas as fileiras e ataques das mãos. Teste JavaFX do piano verifica nove cliques e ausência de outros pedidos de áudio durante a tentativa.
