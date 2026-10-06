> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Guia da entrega — Rastros / três vagões

## Escopo implementado

Menu, abertura de Murilo, três vagões, diálogos por etapa, assentos, bloco físico, jornal, notebook com boot e login **04/06/2000**, cinco documentos integrais, pasta da turma e retorno ao casal que revela **77E**. O primeiro login correto transforma imediatamente os três vagões usando as artes pretas, com um glitch breve de barras. O fluxo termina em um checkpoint salvo; a pasta pode reconhecer o código, mas não revela conteúdo nem cria uma continuação.

FIXO permanece separado: componente e validador preparados, sem hotspot ou bloqueio ativo. Seu local, pista e consequência ainda precisam ser definidos. Os outros puzzles também não bloqueiam a narrativa.

## Arquitetura preservada e ajustes

A base React + Java/JavaFX foi mantida. App coordena as telas e transições; SceneView desenha as composições com hotspots; NotebookView usa os novos JPGs frontais branco/preto/vermelho e encaixa um SO responsivo no retângulo seguro do LCD; Desktop e WindowFrame mantêm janelas, minimização, maximização e posições persistentes. O motor de conversas digitais, TypingIndicator e bridge Java continuam disponíveis.

O roteiro presencial é uma sequência de falas/pensamentos em `systems/narrativeSystem.js`, que escolhe a versão de cada conversa e aplica flags ao concluir. Não foram inventadas árvores morais para preencher os diálogos. `save/saveSystem.js` armazena a história em `chatgame_murilo_v3`; a chave `chatgame_save_v1` fica intacta. O novo esquema inclui boot, autenticação, etapa visual, documento/rolagem, anotações, janelas e posição de diálogo.

A aproximação/saída usa estados explícitos e bloqueia os hotspots. Fechar uma conversa preserva sua posição; “Retomar diálogo” continua do ponto salvo. Recarga durante uma transição retorna a um estado estável. A leitura é concluída explicitamente ao chegar ao final visível do documento, evitando timer que marque texto não lido.

## Onde configurar

Todos os caminhos abaixo partem de `frontend/src` dentro do ZIP.

| Recurso | Arquivo |
|---|---|
| Falas, pensamentos e papéis dos passageiros | `data/npcs.js` |
| Escolha da conversa por etapa e efeitos | `systems/narrativeSystem.js` |
| Contatos digitais | `data/contacts.js` |
| Motor de chat, mensagens apagadas/alteradas/automáticas | `systems/dialogueSystem.js`, `systems/useDialogue.js`, `ChatApp.jsx` |
| E-mails | `data/emails.js` |
| Cinco documentos, pasta e objetos examináveis | `data/files.js` |
| Cenários, fundos e hotspots | `data/scenes.js` |
| Pares de artes de objetos | `data/art.js` |
| Puzzles, soluções e ativação | `data/puzzles.js` |
| Validação de respostas e multi-tap | `systems/puzzleSystem.js` |
| Registro de flags | `data/flags.js` |
| Estado inicial, save e compatibilidade | `save/saveSystem.js` |
| Encaixe do LCD | `systems/screenLayout.js` |
| Estilo físico/digital | `styles/retro.css` |

Chat e e-mail abrem, mas ficam sem contatos/mensagens porque o roteiro não fornece esses conteúdos. Não foram mantidas as pistas fictícias da demo Aurora. A aplicação Casos mostra apenas pistas já descobertas; Anotações oferece texto livre persistente.

## Adicionar um vagão

1. Copiar os assets para `assets/gamejam` ou uma nova pasta organizada.
2. Criar entrada em SCENES com id, label, backgrounds.white/black/red, previous e hotspots.
3. Cada hotspot usa x/y/w/h em percentuais da imagem 16:9; sua transformação é compartilhada com o fundo. Não usar coordenadas da janela inteira.
4. Ligar uma porta com targetCar e configurar entrada/objetivos/variantes em narrativeSystem.
5. Atualizar a validação de currentCarId em saveSystem e sua migração se necessário.
6. Testar ida/volta, proporção diferente e save; não duplicar objetos já desenhados no JPG.

## Adicionar um passageiro

Criar ID narrativo em NPCS com label e lines. Cada linha tem speaker, text e kind opcional (`thought`, `description`, `object`). Criar hotspot type `npc` em SCENES com npcId. Configurar fases específicas em encounter(), quando necessário. Não presumir que `npc três.png` equivale a “silhueta isolada 3”.

## Adicionar uma conversa

Presencial: acrescentar as linhas canônicas ao NPC e selecionar a versão em encounter(). Usar dialogue(save,id,lines,endFlags,after) para preservar progresso e aplicar efeitos somente ao terminar. IDs devem ser estáveis; mudanças incompatíveis exigem decisão de migração.

Digital: cadastrar contato com id, label, status, startNode e nodes no formato do motor preservado. Cada nó tem text e choices; escolhas apontam para next e podem definir flags. ChatApp passa a listar o contato automaticamente. Não reutilizar IDs de falas para diálogos não relacionados. Validar todos os destinos e testar histórico/efeitos.

## Adicionar pasta protegida

Adicionar definição em FOLDERS e puzzle em PUZZLES, com ID estável e solução textual. Acrescentar conteúdo somente quando autorado, associando seus IDs à pasta. Generalizar a seleção em FilesApp para a nova pasta: nesta entrega a UI implementa explicitamente a única pasta canônica, `turma`. Não basta adicionar uma linha de dados para criar automaticamente um explorador arbitrário de pastas.

Configurar validação, condição de disponibilidade e efeito de sucesso. Para pastas futuras com conteúdo autorizado, persistir o desbloqueio em unlockedFolders; não tratar somente a mensagem visual como save. A atual pasta `turma` tem contentPending=true e não altera esse mapa. Remover essa limitação apenas junto com o próximo trecho autorizado e seus testes.

## Flags e avanço do roteiro

`inspectedPhysicalNotepad` habilita novas perguntas no Vagão 2. As flags questioned_isolada1/2 são distintas; só ambas permitem o pensamento de esgotamento. `readNewspaper` registra a pista. A data correta autentica e arma hallucinationPending. `leaveNotebook()` aplica hallucinationStarted uma única vez. Pasta examinada define attemptedClassFolder, altera objetivo e conversas; a fala final define learnedClassCode e chapterComplete.

Não há puzzle para atravessar a primeira porta. A resposta correta do login não exige flags ocultas. A investigação permanece acessível se o jogador souber a senha cedo. Os cinco documentos progridem em ordem e podem ser retomados após saída antecipada.

## Decisões provisórias de arte

- Vagões 1, 2 e 3 usam `vagão um`, `vagão dois` e `vagão três`, respectivamente. `vagão-1` e as bases vazias estão preservados, sem criar vagão extra.
- Jornal: hotspot sobre a mesa, conforme imagem recebida, apesar do texto do roteiro dizer chão. A arte não foi editada.
- Casal do Vagão 1: os dois alvos visuais remetem ao mesmo grupo narrativo; a disposição não é literalmente lado a lado.
- Casal do Vagão 3: o interlocutor em primeiro plano representa o grupo; a segunda pessoa não recebeu sprite inventado. As duas silhuetas isoladas continuam com suas próprias falas.
- Vagão 1 permanece branco ao revisitar; a regra de transformação confirmada foi aplicada aos vagões 2 e 3.
- Objetos ampliados usam os PNGs originais em branco/preto. Os JPGs já compostos não recebem PNGs duplicados por cima.
- LCD usa um retângulo frontal nas novas artes de tela, sem projeção ou distorção. Limites normalizados ficam em screenLayout.js. As artes antigas do notebook físico permanecem disponíveis.

## Placeholders e artes ainda necessárias

Comentários TODO ART/TODO NARRATIVE identificam as pendências. Não há mais Vagão 2 reutilizando a arte do primeiro.

Ainda provisórios: associação visual dos casais e representação textual legível dos documentos de inspeção. Os 34 assets anteriores e as duas novas telas estão preservados sem alteração. Os ícones do desktop agora são SVGs locais próprios em RetroIcon.jsx. Antes de redesenhar, confirmar se versões complementares já existem.

Para FIXO: wallpaper Y2K, pista da palavra e objeto/tela de encaixe. Para os puzzles futuros: cofre/Bíblia, piano/partitura/sons, relógio e eventuais elementos de alquimia/forca. Melodia, receitas, palavra da forca e recompensas não foram inventadas. A continuação precisa fornecer conteúdo da pasta 77E e demais cenas/falas.

## Limites

O SO é uma interface ficcional local, sem rede real ou contas externas. As senhas são mecânicas narrativas, não proteção de dados. Não há final adicional, Vagão 4 ou novos monstros. O save é específico da origem do navegador ou do WebView; não há sincronização entre eles.


Atualização de 30/09/2026: consulte ATUALIZACAO-OS.md para paleta, sprites, pensamentos sobrepostos, migração e testes atuais.
