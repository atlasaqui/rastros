# Rastros — piano e encerramento cinematográfico

Esta revisão substitui o encerramento com botões de diálogo por uma sequência automática. Conserva o roteiro e as correções anteriores.

## Exploração

A inspeção do teclado apresenta “(Eu acho que já vi isso em algum lugar.)”. O objetivo “Reconhecer a música que ficou na memória.” aparece no cenário e no caderno. Consultar a partitura na galeria do computador, depois dessa inspeção, atualiza ambos para “Tocar a música que ficou.”. A tela do piano e o caderno não exibem mais uma cópia da partitura. O jogador pode sair do instrumento, voltar ao computador e retornar ao Vagão 4 sem repetir a fuga.

A partitura do computador e a sequência de teclas continuam coerentes com a solução provisória A4, A6, A8, A6, A5, A4. Não foi fornecida uma partitura definitiva de Chamber of Reflection; esta revisão não declara que a sequência técnica seja sua transcrição.

## Música

Foi selecionado o arquivo original `28 - ENCERRAMENTO (Chamber Of Reflection - Your Anxiety Buddy).wav`, catalogado como 28, com duração medida de 137 segundos. O arquivo alternativo 28b tem 79,573333 segundos e não é usado nesta cinemática.

Uma única reprodução da faixa 28 conduz piano, mãos, falas e créditos. Não há troca ou reinício ao entrar nos créditos. O volume global e o silêncio continuam funcionando; a linha do tempo avança também com volume zero.

**Escolha de duração:** a liberação de Continuar foi colocada no término real da faixa completa, em 137 segundos. Isso preserva integralmente o trecho principal, sem atribuir um timestamp de refrão que não foi identificado por escuta. As ferramentas desta sessão não forneceram escuta do áudio ao modelo; a análise local confirmou duração, formato e níveis dos dois arquivos. Não se apresenta uma marcação de refrão como se tivesse sido audicionada. O ponto de liberação pode ser antecipado posteriormente mediante um marcador musical confirmado; encontra-se em `ENDING_TIMES.continueAt`.

## Linha do tempo

Os tempos abaixo são segundos de reprodução real da música, lidos do player nativo.

| Intervalo | Cena |
|---|---|
| 0–1,5 | Piano desaparece para preto; cauda da última nota preservada |
| 1,5–4,2 | Murilo / “...” — 350 ms de entrada, 2 s legíveis, 350 ms de saída |
| 4,2–5 | Entrada suave das mãos ensanguentadas |
| 5–9 | Mãos e “(Eu reconheço estas mãos.)” plenamente visíveis |
| 9–10,5 | Fade out das mãos em exatamente 1,5 s |
| 10,5–26,7 | Seis cartões do roteiro; cada cartão tem 2 s legíveis e dois fades de 350 ms |
| 26,7–28,7 | Pausa sobre o preto, com música contínua |
| 28,7–47,5 | Quatro créditos individuais; 4 s legíveis mais dois fades de 350 ms por crédito |
| 47,5–137 | Título e composição final dos créditos; música completa continua |
| Término real da faixa | Continuar aparece; o jogador pode permanecer na tela |
| Clique em Continuar | Fade de 1,5 s, preservação do progresso e retorno ao menu |

O roteiro final mantém a pergunta da Sombra, a lembrança de Murilo sobre Renata acima do piano e a repetição “Não há recomeço sem ela”. A fala longa de Murilo foi dividida em três cartões para permitir leitura em dois segundos. A frase das mãos é a ligação narrativa proposta nesta revisão.

## Créditos

- Narrativa — Amanda Queiroz
- Arte 2D — Luana Meneghini
- Game Design e Sound Design — Matheus Medeiros
- Programação e UX Design — Victor Monteiro

## Persistência e apresentação

O save armazena posição musical e etapa da cinemática a cada segundo. Reabrir permite continuar de onde parou sem tocar o piano novamente. Saves concluídos de versões antigas abrem a composição de créditos com Continuar disponível.

A imagem `mão sangrenta.png` foi copiada sem alteração para `frontend/public/media/mao-sangrenta-final.png`; seu tamanho e proporção originais são preservados. A distribuição inclui o arquivo, sem depender da pasta Downloads. A cinemática oculta cursor personalizado, objetivos e controles de exploração; Esc e teclas de avanço não pulam as falas.

Os relatórios `TESTE-CINEMATICA-*` registram a validação desta revisão. Os relatórios anteriores são histórico e não substituem os atuais.

Validação de lógica: 49 testes passaram, incluindo sequência das cenas, tempos de leitura, fade das mãos, bloqueio de Continuar, créditos, objetivos e migração de save.

