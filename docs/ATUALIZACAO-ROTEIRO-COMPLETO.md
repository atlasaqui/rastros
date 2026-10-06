# Rastros — roteiro completo e continuação

Esta documentação prevalece sobre os guias históricos que encerram o jogo em 77E. Base React/Vite e JavaFX preservada. O novo percurso chega ao final das 17 páginas, com as adaptações aprovadas no prompt.

## Como executar

Extraia toda a pasta Windows e abra Rastros.exe. Mantenha app e runtime ao lado dele. Não precisa instalar Java/Node, abrir navegador ou iniciar localhost.

O save permanece em %LOCALAPPDATA%/Rastros/save/progress.json, com progress.backup.json. Não apague essa pasta para atualizar. Saves em 77E conservam dados antigos, mas esse checkpoint não concede Bíblia, explorador ou final novo.

## Mudanças de roteiro e regras

- Login inicial: 04/06/2000, convencional, sem dica explícita.
- Explorador: 415, pista na Bíblia. 77E deixou de ser senha do percurso atual.
- Relógio no Vagão 3: primeiro clique inspeciona, segundo permite mover ponteiros. Inicialmente representa 19:07 (7:07 no mostrador de 12 horas); solução 00:14, com click e trava.
- Matrícula da Renata inclui a anotação aprovada: “00:14 — um minuto antes de não haver recomeço.” Liga-se à entrada 22/09-00:15.txt.
- Messenger bloqueado por jogo da memória. O relógio correto habilita peças. Quatro pares desbloqueiam conversas e galeria.
- As três conversas devem ser concluídas. Confirmar o último pensamento força a saída do computador.
- Captura pela sombra volta ao Messenger, após os puzzles. Use “Afastar-se novamente” para reiniciar a fuga.
- Sete segmentos horizontais em pixel art própria. Diálogos e pausa suspendem a simulação; perda de foco também pausa.
- Depois da fuga, glitch e vermelho no vagão vazio. A arte “vagão quatro alucinação” já inclui o teclado, sem adicionar outro sprite.
- Piano: inspeção do desenho, depois Tocar piano. A partitura pode ser consultada ali e pelo diário. Sequência técnica de teste: C4 E4 G4 E4 D4 C4.
- Ao acertar, música provisória automática e falas finais canônicas. Continuar viagem após o final recupera a conclusão.

## Controles

Mouse ou Tab/Enter; E abre notebook no Vagão 2; Escape fecha inspeções e diário ou afasta do notebook quando permitido. Relógio: arraste ponteiros ou use campos de horas/minutos. Fuga: setas/A/D, controles na tela, pausa. Piano: clique nas teclas; foco no teclado e A S D F G H J K para brancas, W E T Y U para pretas. Volume no painel do piano.

## Arquitetura e edição

| Recurso | Arquivo em frontend/src |
|---|---|
| Novos documentos, chats, galeria, música e final | data/continuation.js |
| Relógio, memória, checkpoint, migração, fuga concluída | systems/continuationSystem.js |
| Bíblia, sombra, diálogos do confronto | systems/narrativeSystem.js |
| Objetivos, disponibilidade e conclusão | data/objectives.js |
| Histórico/paginação do diário | systems/journalSystem.js |
| Diário, argolas superiores, partitura lembrada | components/Journal.jsx; styles/journal.css |
| Fundos e hotspots | data/scenes.js; components/SceneView.jsx |
| Variantes e imagens de relógio/mãos/piano | data/art.js |
| Horas/minutos e montagem não destrutiva dos ponteiros | components/ClockPuzzle.jsx |
| Memória, galeria, documentos e histórico MSN | components/ContinuationApps.jsx |
| Perseguição, velocidade/colisão e sete segmentos | components/EscapeGame.jsx |
| Vista frontal, notas, áudio e final | components/PianoPuzzle.jsx; systems/audioSystem.js |
| Integração e modais | App.jsx |
| Save v3 e ponte nativa | save/saveSystem.js; Java SaveStore/JavaBridge/Main |

Novos estados ficam em continuation, com relógio, deck/pares, leituras, posição dos chats, contador de tentativas e piano. Flags novas controlam sombra, Bíblia, explorador, retorno temporal, CAPTCHA, saída obrigatória, confronto, fuga, cenário final e conclusão. IDs antigos são preservados quando necessários para migração.

Para substituir a música, edite PIANO.notes e PIANO.duration em data/continuation.js. A partitura é derivada da mesma sequência para evitar resposta divergente; ampliar mapeamento gráfico/teclas quando forem fornecidas notas fora da oitava provisória. Esta melodia NÃO é Chamber of Reflection.

## Placeholders e pendências

- Piano frontal: teclas desenhadas em código aguardam arte final.
- Partitura/música: sequência original técnica de teste; aguardam notas e partitura definitivas. Sons sintetizados locais, sem gravação externa.
- Fotos da galeria: painéis descritivos com imagens indicadas como registros; os três desenhos/fotos definitivos não foram fornecidos. Partitura provisória aparece como quarta imagem.
- Bíblia: passagem textual na UI narrativa, aguardando arte de inspeção.
- Horários escolares: descrições do roteiro, sem tabelas inventadas. Enviar horários completos se necessário.
- Fontes tipográficas futuras não foram inventadas/importadas.
- Bloco segue desenhado no fundo após coleta; hotspot passa a abrir diário. Faltam variantes sem bloco.
- Jornal permanece na mesa conforme arte, embora PDF diga chão.

Os originais novos foram preservados; as montagens/cortes do relógio são feitos na renderização. Nada foi baixado para imitar fotos ou música ausentes.

## Adaptações registradas

O texto complementar aprovado fixa relógio no Vagão 3 e vermelho no retorno da fuga. O PDF por vezes menciona relógio no Vagão 2 e vermelho antes da perseguição. Aplicou-se a instrução recente. O vagão vazio antes da fuga usa temporariamente a arte final em escala de cinza, mantendo o vermelho para o retorno. Sete segmentos do minigame não criam sete mapas narrativos.

## Validação

Consulte TESTES-ROTEIRO-COMPLETO.md e as capturas. npm test executa regressão e continuação. O modo opt-in Rastros.exe --smoke usa diretório app/test-save e nunca o save pessoal. --smoke-resume testa um segundo processo com esse progresso. A distribuição normal não ativa esses testes.
