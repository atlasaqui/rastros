# Rastros — revisão de assets, áudio e interface

Extraia a pasta inteira do pacote Windows e abra **Rastros.exe**. O runtime Java e os arquivos de som estão incluídos; não é necessária instalação de Java. A pasta `app` deve permanecer junto ao executável. O save pessoal continua em `%LOCALAPPDATA%/Rastros/save`. Os testes usam outra pasta e não alteram esse save.

## O que mudou

- Aviso sonoro automático de aproximadamente um segundo, triângulo ampliado e controles de volume/silêncio no menu.
- Introdução automática com os tempos do guia, sem botão Continuar.
- Cursores originais nas três cores, mão de coleta, indicação discreta junto ao objeto e áreas distintas para personagens e passagem entre vagões.
- Bloco retirado da mesa após coleta; anotação original `M. Pedrosa / 04/06 - motivação?` preservada no diário. Usuário do computador: Pedrosa.
- Interface com fundos, texto e bordas legíveis nas fases branca, preta e vermelha, preservando a apresentação do computador.
- Relógio em duas aproximações com as artes enviadas, dois ponteiros móveis e painel de horas/minutos/segundos. Os segundos ficam em 00, pois foram fornecidos apenas dois ponteiros. A solução continua 00:14 e o efeito correspondente dura cinco segundos.
- Vagão 4 com a arte de alucinação enviada, inspeção do teclado e piano frontal com quinze regiões interativas e os respectivos estados pressionados.
- Retorno ao computador para consultar a partitura, conservando o estágio vermelho e permitindo voltar ao vagão 4 sem repetir a fuga.
- Áudio local real, volume global, transições entre trilhas, caudas de notas e retomada das transições salvas.

## Sequência narrativa e cues

| Evento | Resultado visual | Entrada da trilha |
|---|---|---|
| Início | Branco, sem sombra | Estágio 1 no instante 9,5 s da introdução |
| Senha correta do usuário | Glitch para preto | Estágio 2 em +2,5 s |
| Senha correta dos arquivos | Glitch para branco, aparição da sombra | Estágio 3 em +1,5 s |
| Interação com sombra/cortina | Glitch para preto, cortina fechada, sombra ausente | Estágio 4 em +4 s |
| Vitória na fuga em pixel art | Glitch para vermelho, vagão 4 | Estágio 5 em +0,5 s |

Introdução: buzina no instante 0; texto e abertura no instante 4; texto entra em um segundo; o preto começa a revelar o cenário no instante 9; estágio 1 entra no instante 9,5; cenário assume a interação no instante 10. A cauda real da buzina (4,5414 s) é preservada. A abertura termina por volta do instante 12.

O guia chama abertura/estágio 1 de 33/34, mas os arquivos e a lista os numeram 22/23. O jogo utiliza os arquivos reais 22/23. As quatro transições numeradas 20 são diferenciadas pela pasta e pelos identificadores `glitch-1-2` a `glitch-4-5`. A trilha anterior diminui durante a entrada da próxima (350 ms); os efeitos de transição continuam até terminar, incluindo a cauda de 3–4. As trilhas dos estágios repetem; abertura, resolução do relógio e encerramento não repetem.

O catálogo cobre os 54 arquivos recebidos (53 WAV e um MP3). Os WAV de execução foram convertidos para PCM 16 bits para compatibilidade com JavaFX, mantendo taxa de amostragem, canais e duração. Os nomes originais, metadados e hashes estão no inventário. Os efeitos de interface, navegação, falas, digitação, objetos, senhas e relógio usam os arquivos correspondentes; o piano usa os quinze samples individuais.

## Piano e decisões documentadas

Os nomes das imagens pressionadas estão em ordem inversa: A1 usa `tecla apertada oito.png`, até A8 usar `tecla apertada um.png`; B1 usa `tecla pressionada sete.png`, até B7 usar `tecla pressionada um.png`. As regiões foram medidas na arte original para evitar acionar uma tecla vizinha. Cada sample conserva a cauda de 5,5 segundos.

**A melodia de solução continua provisória.** Os arquivos novos não especificam uma sequência musical definitiva. Foi mantida a sequência técnica já existente, transposta para os samples recebidos: A4, A6, A8, A6, A5, A4 (C5, E5, G5, E5, D5, C5). A partitura apresentada corresponde a essa sequência. Não houve criação de uma solução oficial nova.

Atalhos: A, S, D, F, G, H, J, K para A1–A8; Q, W, E, R, T, Y, U para B1–B7. Mouse e teclado mostram a arte pressionada; soltar a tecla libera a imagem sem cortar a cauda do sample. Esc permite sair antes da conclusão.

Os arquivos de encerramento 28/28b não receberam um cue específico no guia. Nesta versão, 28b acompanha a resolução do piano e o diálogo final; 28 acompanha a tela de encerramento. A última nota conserva sua cauda antes de abrir o diálogo. Essa é uma decisão de implementação, passível de alteração quando houver direção musical definitiva.

O novo `jornal amassado vermelho.png` contém a arte de um bloco de notas; por isso foi preservada a arte correta de jornal já existente. A remoção do bloco usa uma pequena reconstrução da mesa limitada à região do objeto; o restante da ilustração é preservado.

## Validação

Os relatórios desta entrega registram testes de lógica, percurso completo no executável JavaFX, medição dos cues, retomada de save e inspeção de assets em 1280×720, 1366×768, 1920×1080 e 820×900. A pasta de teste não é distribuída no pacote Windows. Consulte os relatórios atuais `TESTE-ASSETS-*`; relatórios anteriores em `docs` são histórico do projeto.
