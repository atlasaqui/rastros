> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Rastros — diário de objetivos e ícones

Atualização de 30/09/2026. O sistema continua sendo Iwakura OS e a narrativa termina na pista 77E.

## Como jogar

No Vagão 2, examine o bloco junto ao computador. Termine a inspeção e os pensamentos existentes, depois escolha **Recolher bloco de notas**. O botão **Bloco de notas** aparece no canto superior direito do cenário. No computador, aparece no canto inferior esquerdo, fora do monitor.

O botão sinaliza novas anotações e conclusões. O diário escreve cada anotação nova, permite **Mostrar tudo**, registra conclusões com check e risco, e mantém duas anotações por página. Use os botões Anterior/Próxima ou as setas do teclado. Escape fecha somente o diário. A página consultada e o histórico ficam no save. Se fechar durante a escrita, a anotação continua pendente para a próxima abertura; o objetivo não é perdido.

Não é possível abrir o diário durante boot, glitch, pensamentos, inspeções, transições ou pop-ups de senha. O diário bloqueia o cenário/OS enquanto está aberto e devolve o foco ao botão de origem ao fechar.

## Objetivos do trecho

Os nomes das flags nesta tabela são documentação de desenvolvimento, não dicas mostradas ao jogador.

| ID | Anotação | Disponível quando | Concluído quando |
|---|---|---|---|
| access | Talvez aquele computador guarde alguma resposta. | Bloco recolhido | Primeiro login correto (`notebookAuthenticated`) |
| voices | Talvez uma conversa ajude a entender o que está acontecendo. | Bloco recolhido | Diálogos pós-inspeção dos dois passageiros concluídos (`v2Exhausted`), ou revelação final obtida (`learnedClassCode`), caso a investigação siga outra ordem |
| read | Preciso entender o que ficou escrito aqui. | Login correto | Todos os cinco documentos realmente marcados como lidos |
| locked | Ainda pode haver algo entre esses arquivos. | Cinco documentos lidos | Pasta protegida examinada (`attemptedClassFolder`) |
| witness | Alguém deve saber mais do que está dizendo. | Pasta protegida examinada | Diálogo da revelação concluído (`learnedClassCode`) |

As condições usam as ações existentes. Consultar o diário e visitar vagões não conclui objetivos. A anotação sobre a pasta significa investigar o bloqueio; não afirma que a pasta foi desbloqueada. Não foram implementados novos puzzles ou capítulos.

## Arquitetura e extensão

- `frontend/src/data/objectives.js`: textos, ordem estável, disponibilidade e conclusão. Para acrescentar objetivos, crie um ID permanente e predicados que leiam as flags/dados reais do save. Acrescente ao fim para manter páginas antigas estáveis. Não coloque códigos, soluções ou localização da pista no texto.
- `frontend/src/systems/journalSystem.js`: coleta, migração, sincronização do histórico, apresentação e paginação. `JOURNAL_PAGE_SIZE` controla o número de anotações por página.
- `frontend/src/components/Journal.jsx`: modal físico, ícone vetorial da UI, escrita, confirmação visual e navegação.
- `frontend/src/styles/journal.css`: papel, espiral, lápis, abertura/fechamento e virada de página. Desenho em CSS/SVG, sem biblioteca externa, novos sons ou assets gerados.
- `App.jsx`: sincroniza o diário em cada mudança do estado do jogo e apresenta a coleta após a inspeção.
- `NotebookView.jsx`: integração do botão e suspensão do foco do OS quando o diário está aberto.
- `save/saveSystem.js`: conserva a chave v3 e o save nativo. Dados novos em `journal`: `collected`, `known`, `completed`, `revealed`, `completionShown`, `page`, `opened`.

Anotações conhecidas nunca desaparecem. Escrita e animação de conclusão têm registros separados. A ordem define páginas fixas; novas descobertas não reorganizam as páginas anteriores. Objetivos ainda desconhecidos não são mostrados. A primeira abertura procura a página com uma investigação pendente; as seguintes preservam a página do leitor e sinalizam novidades nas demais.

## Compatibilidade

Um save antigo sem a versão do diário recebe o bloco somente se `inspectedPhysicalNotepad` já estiver concluída. O histórico é inferido das flags existentes, sem reproduzir animações antigas. Apenas ter visitado o Vagão 2 não concede o bloco. Nos saves desta versão, examinar e recolher são ações distintas, inclusive após recarregar.

O executável mantém `%LOCALAPPDATA%/Rastros/save/progress.json` e `progress.backup.json`. Os testes utilizam um diretório separado. Não apagar a pasta pessoal para atualizar.

## Ícones

Somente **Lixeira** e **Mensagens** receberam coordenadas e tratamento de borda específicos em `data/osAssets.js` e `systems/iconBackground.js`. O restante usa o processamento anterior aprovado. As folhas originais continuam intactas. A máscara remove o fundo externo conectado às bordas, incluindo pequenas frestas diagonais e resíduos de JPEG; não remove preenchimentos brancos fechados. `RetroIcon.jsx` escolhe o tratamento pelo campo `detailedMask`.

## Arte pendente

**O bloco físico faz parte da imagem de fundo fornecida.** Após a coleta, seu hotspot vira consulta do diário, sem permitir outra coleta. A ilustração continua no cenário: não foi apagada nem coberta por um remendo. `SceneView.jsx` contém `TODO ART` solicitando as variantes do Vagão 2 sem o bloco, nas paletas branca, preta e vermelha. O diário da UI é desenhado em código, não é um asset final externo presumido. A arte de inspeção original continua sendo reutilizada.

As pendências anteriores de arte e roteiro continuam documentadas nos guias do projeto. Nenhum gatilho para o cenário vermelho foi inventado.

## Arquivos desta atualização

Criados: `data/objectives.js`, `systems/journalSystem.js`, `components/Journal.jsx`, `styles/journal.css`, este guia e o relatório de testes do diário.

Alterados no frontend: `App.jsx`, `main.jsx`, `save/saveSystem.js`, `components/SceneView.jsx`, `components/NotebookView.jsx`, `components/RetroIcon.jsx`, `systems/iconBackground.js`, `data/osAssets.js`, `tests/systems.test.mjs`, `tests/webview-smoke.js`.

Java: `SmokeCheck.java` recebeu mais tempo para o teste completo de UI. Build regenerado em `src/main/resources/web/index.html`. Nenhum arquivo foi removido.

## Entrega

Extraia todo o ZIP Windows e abra `Rastros.exe`; conserve `app` e `runtime` juntos. Não precisa de navegador, localhost, Java ou Node instalados. O ZIP de fontes contém o projeto e seus assets, sem caches, dependências de desenvolvimento ou saves de teste.
