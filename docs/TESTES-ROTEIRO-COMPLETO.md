# Verificação da atualização

- npm install --offline --ignore-scripts: 74 pacotes instalados do cache; sem vulnerabilidades reportadas.
- npm test: 34 testes passaram, incluindo regressão, 415, hora exata, memória bloqueada, migração de 77E, checkpoint, religiosa/Bíblia e saída automática após o pensamento.
- npm run dev: servidor iniciou; GET local retornou HTTP 200 e título Rastros. Servidor encerrado depois do teste.
- npm run build: build portátil de produção concluído.
- mvn -o compile: compilação Java concluída. Maven reporta avisos do modelo das dependências JavaFX, sem falha de build.
- SaveStoreCheck: reabertura nativa, rejeição de JSON inválido, recuperação do backup e falha de escrita passaram em diretório temporário.
- Executável Rastros.exe --smoke: percurso de novo jogo até final, com Bíblia/415, cinco documentos escolares, pista 00:14, relógio, CAPTCHA inicialmente bloqueado e depois resolvido, galeria, três chats, pensamento final e saída obrigatória, captura real e retry, sete segmentos exatos, glitch vermelho, piano provisório e falas finais. PASS.
- Piano e partitura verificados no WebView em 1280×720, 1366×768, 1920×1080 e 820×900; painel fica dentro da janela.
- Segundo processo, Rastros.exe --smoke-resume: final, relógio, CAPTCHA, tentativas e diário preservados. Sem repetição de boot/glitch e sem erro de save. PASS.
- QA isolada adicional: ponteiros originais montados nas paletas branca/preta/vermelha; contraste aplicado na renderização e altura explícita para compatibilidade JavaFX. Capturas conferidas.

Os testes do executável utilizam app/test-save. Não alteraram o save pessoal em %LOCALAPPDATA%/Rastros/save. As capturas estão em docs/capturas.

## Limites da verificação

A melodia definitiva e suas artes ainda não foram fornecidas: o final foi percorrido com a sequência técnica original C4 E4 G4 E4 D4 C4. O relatório comprova controles e progressão; não comprova semelhança com a música futura. Sons são sintetizados e a verificação visual não é uma avaliação perceptiva de áudio.

Fotos da galeria, Bíblia ilustrada e horários escolares completos permanecem como apresentações provisórias/documentais. Esses limites estão detalhados no guia.

O teste automatizado percorre a captura e a fuga com eventos no WebView real, não por uma flag que salta o minigame. Não substitui uma avaliação humana do equilíbrio da perseguição; velocidades podem ser ajustadas após jogar.
