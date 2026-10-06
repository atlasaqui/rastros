# Partitura anotada

Após examinar o piano, selecionar novamente Tatá no computador registra scoreReviewedAfterPiano, inclusive se o histórico já tinha sido lido. A opção de partitura na Galeria também registra a releitura. Essa flag já é persistida pelo save existente.

O caderno mostra ambas as frases em uma seção de partitura anotada. No piano, o mesmo dado de PIANO_NOTE_PHRASES gera um papel recortado com as duas frases, sem precisar fechar o instrumento. Não aparece antes da releitura e não mostra acertos parciais. Sem limite de tempo.

Alterados: continuationSystem.js, Journal.jsx, PianoPuzzle.jsx, worldUnified.css; testes piano-input.test.mjs e piano-guide-smoke.js. 70 testes passaram, incluindo releitura e persistência. Build web regenerado.
