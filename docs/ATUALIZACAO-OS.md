> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Rastros — atualização de OS e cenários

30/09/2026. Esta entrega trabalha sobre a base React + JavaFX anterior. Não substitui o motor do jogo nem continua o roteiro depois da pista 77E.

## Alterações

- Desktop com paleta das pranchas: vinho escuro, cinzas amarronzados, bege e papel claro. Wallpaper discreto, ícones fornecidos, controles de janela, login, explorador, Messenger e avisos reformulados.
- Login convencional de conta local, senha mascarada e sem dica visível ou máscara de aniversário. A senha provisória continua `04/06/2000`; o validador anterior também aceita `04062000`, preservando compatibilidade. FIXO permanece separado e inativo.
- Primeiro login correto ativa imediatamente o estado preto, ainda dentro do computador, com uma ruptura breve de barras pretas animadas sobre a tela inteira. O efeito é inspirado na descrição fornecida da parede de urso de Inscryption; não utiliza imagens ou sons extraídos desse jogo. Movimento reduzido usa uma troca discreta.
- Glitch é transitório, não salvo; o resultado narrativo é salvo imediatamente. Recarregar não repete o susto. Pensamentos são enfileirados e persistidos até confirmação.
- Pensamentos de Murilo aparecem sobre o OS com o mesmo estilo do mundo, bloqueando a interação inferior até Continuar. Escape não pula pensamento nem sai do notebook simultaneamente.
- Objetivo no alto e localização em indicador independente na parte inferior. O menu mantém removidas as duas frases anteriormente solicitadas.
- Os três vagões usam as novas versões branca, preta e vermelha. O primeiro login torna os três pretos, substituindo a exceção antiga que mantinha o primeiro branco.
- Novos JPGs frontais integram moldura e entorno. O sistema permanece reto dentro do LCD; nas margens excedentes da janela há o cenário atual suavizado.
- Jornal, primeira inspeção do bloco físico e reinspeção usam `ObjectInspection`: arte acima e texto abaixo. Assets são pré-carregados; espaço da arte é reservado. Jornal é marcado como inspecionado ao fechar sua apresentação.

## Assets: o que foi utilizado

Os nove arquivos do OS são pranchas JPG, não sprites transparentes. Os originais foram preservados. Recortes por SVG `viewBox` usam coordenadas documentadas em `data/osAssets.js`; o desenho não foi refeito por geração de imagens. Fundos claros dos ícones são placas de papel deliberadas.

Uso direto: Icons, Icons Complete Library, Window Library, LOGIN, MSN e Popups. My Computer e UI Control orientam as composições escaláveis e os estados dos controles HTML/CSS. Cursor fica catalogado: nesta versão os ponteiros são nativos, pois o JPG contém quadriculado incorporado; não foi usado como se fosse transparente. A biblioteca restante está reservada para conteúdos futuros, sem criar contatos, arquivos, erros ou aplicativos fictícios.

`ASSET-MANIFEST-OS.json` registra caminhos, hashes, dimensões e uso das pranchas e cenários. Os 24 cenários novos foram copiados sem alteração; arquivos anteriores não foram apagados. As vistas de relógio e as alternativas de cortina estão preservadas, sem inserir puzzles ou cenas não previstos no roteiro.

## Arquitetura e configuração

Todos os caminhos seguintes partem de `frontend/src`:

| O que configurar | Onde |
| --- | --- |
| Cores, wallpaper, janelas, login e controles | `styles/os.css` |
| Identidade do mundo, menu e diálogo | `styles/retro.css` |
| Origem/recortes dos ícones e controles | `data/osAssets.js`, `components/RetroIcon.jsx` |
| Vagões, três fundos e hotspots | `data/scenes.js` |
| Tela frontal e objetos por variante | `data/art.js` |
| Retângulo seguro do LCD e limites das janelas | `systems/screenLayout.js` |
| Autenticação, variante visual e progressão | `systems/narrativeSystem.js` |
| Duração/composição do glitch | `components/GlitchTransition.jsx`, `styles/os.css` |
| Fila e confirmação dos pensamentos do PC | `systems/thoughtSystem.js`, `components/ThoughtOverlay.jsx` |
| Jornal e bloco físico | `components/ObjectInspection.jsx`, `data/files.js` |
| NPCs e falas presenciais | `data/npcs.js` |
| Contatos/conversas digitais | `data/contacts.js`, `systems/dialogueSystem.js` |
| E-mails e arquivos | `data/emails.js`, `data/files.js` |
| Puzzles e flags | `data/puzzles.js`, `data/flags.js` |
| Migração e persistência | `save/saveSystem.js` |

`App` continua coordenando as telas. `NotebookView` compõe boot/login/desktop e modais narrativos; `Desktop`/`WindowFrame` preservam gerência de janelas. `OsPopup` utiliza texto vivo, ícones fornecidos e foco de teclado. `thoughtSystem` impede pensamentos duplicados. Os dados narrativos continuam separados da apresentação.

O save mantém a chave `chatgame_murilo_v3` e `version:3`; `presentationVersion:2` identifica esta revisão. Campos novos: `visualState`, `thoughtQueue`, `seenThoughts`. Saves antigos autenticados migram para preto sem repetir glitch; leituras, notas e progresso são preservados. Um pensamento de login ainda não confirmado pode aparecer após retomar, sem reexecutar o evento visual.

## Expandir depois

- Novo vagão: adicionar fundos `white/black/red` em `data/scenes.js`, hotspots percentuais sobre o canvas 16:9, ligações de portas e condições narrativas. Atualizar a validação dos IDs do save quando houver um quarto vagão.
- Novo passageiro/conversa: registrar NPC/falas em `data/npcs.js`, escolher o estágio em `narrativeSystem` e ligar seu `npcId` a um hotspot. Conversas digitais usam contatos e o motor digital existente.
- Nova pasta protegida: adicionar pasta em `data/files.js`, puzzle em `data/puzzles.js`, condição de acesso e efeito persistido; ligar a apresentação em FilesApp. Não usar apenas um botão decorativo que libera tudo.
- Novo pensamento de PC: fornecer ID estável e texto para `enqueueThought`. Confirmar por `acknowledgeThought`, sem disparar eventos durante a renderização.
- Ativar vermelho: definir primeiro o evento no roteiro; então alterar `visualState` nesse evento. Não há contador oculto nem acionamento por tempo nesta entrega.

Prévia exclusivamente de desenvolvimento: `npm run dev`, URL com `?previewVariant=white`, `black` ou `red`. Isso muda apenas a apresentação e não grava a variante de prévia no save. O parâmetro não funciona no build de produção nem no executável. Remover o parâmetro para voltar ao fluxo normal.

## Pendências explícitas

- Gatilho narrativo do vermelho, senha definitiva e pista externa aguardam o autor.
- Objetos físicos não receberam artes vermelhas próprias: a prévia usa suas versões pretas, com `TODO ART` em `data/art.js`.
- O conjunto não contém cortina vermelha separada nem arquivo denominado “vagão dois vermelho relógio”; não se inventou uma composição adicional. O cenário vermelho fornecido para o vagão 2 já mostra o relógio.
- Associação do casal do terceiro vagão e posição do jornal conservam os placeholders documentados: um interlocutor visível representa o casal; a arte situa o jornal sobre a mesa.
- Contatos/e-mails permanecem sem conteúdo, como na base canônica. Os exemplos das pranchas não viraram personagens da história.
- Cursores personalizados ficam reservados até haver recortes transparentes adequados. Os nativos mantêm interação e foco corretos.

## Windows

Extrair `Rastros-OS-Windows.zip` e abrir `Rastros.exe` dentro da pasta extraída. Manter `app` e `runtime` ao lado do executável. É uma distribuição portátil x64, com Java/JavaFX incluídos; não inicia servidor nem exige site. Não é um instalador ou um EXE único que possa ser separado de suas pastas.

Save normal: `%LOCALAPPDATA%/Rastros/save`. O navegador usa armazenamento independente. Testes `--smoke` usam save isolado e não alteram o progresso normal.

Reconstrução: `tools/package-windows.ps1` com JDK 21 e dependências Node/Maven. Essa exigência vale somente para desenvolvimento, não para o jogador.
