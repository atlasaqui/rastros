# Matriz do PDF completo

| Páginas | Cena | Entrada/efeito | Implementação |
|---|---|---|---|
| 1–2 | Abertura, assentos, casal, suspeito e religioso | Novo jogo; primeira visita | Intro/App; NPCS; religiosa_first |
| 2–3 | Vagão 2, mesa, passageiros, bloco | Inspeção concluída; coleta distinta | discoverTable; collectJournal; objetivos |
| 4 | Jornal e passageiros do Vagão 3 | Inspeção do jornal e diálogos | OBJECTS; NPCS; readNewspaper |
| 5 | Relógio e login | Relógio em duas interações; login 04/06/2000 | ClockPuzzle; authenticate; glitch preto |
| 5–7 | Cinco documentos iniciais | Rolagem até fim + concluir leitura | DocumentsApp; thoughtSystem |
| 8–9 | Explorador restrito, sombra/cortina | Tentativa de acesso; saída ou tentativa de viajar | attemptFolder; leaveNotebook; SHADOW_LINES |
| 9–10 | Respostas sobre sombra e retorno ao religioso | shadowSeen; pecador nos outros NPCs | encounter; BIBLE_LINES |
| 10–11 | Bíblia e mãos | bibleSeen; visão com recomposição | HandsVision; handsBibleSeen |
| 11–12 | 415 e cinco documentos escolares | explorador desbloqueado | SchoolExplorer; SCHOOL_FILES |
| 12–13 | CAPTCHA inerte, recomeço e relógio | explorerUnlocked; timeReturned em 00:14 | MemoryPuzzle; setClock |
| 13 | Memória e galeria | Quatro pares; conteúdo desbloqueado | matchMemory; GALLERY |
| 13–14 | Gerâncio, Priscila, Tata/Renata | Conversas consultadas até última mensagem | CHATS; readChat |
| 15 | Pensamento final e saída obrigatória | Três conversas + confirmação | messages_end; messageExitRequested |
| 15–16 | Confronto, mãos e confissão | Confrontation concluída | CONFRONTATION; HandsVision antes da fuga |
| 16 | Fuga e falas da verdade | Sete segmentos; captura retorna ao checkpoint | EscapeGame; retryEscape |
| 16 | Último vagão, música | Sucesso; glitch vermelho; piano em duas etapas | finishEscape; finalRoom; PianoPuzzle |
| 17 | Música automática e final | Sequência de teste correta; falas finais | PIANO; ENDING; gameComplete |

A anotação 00:14 é uma adição aprovada no pedido complementar. As falas finais são do PDF; não há final feliz adicional. A senha 77E e o antigo fim de trecho foram substituídos na progressão atual. Os registros antigos ficam preservados por compatibilidade.

Falas do confronto dos vagões 1/3 foram concentradas na sequência anterior ao minigame para seguir a adaptação solicitada de saída, sombra e fuga; estão na ordem do roteiro. A cor vermelha foi postergada conforme o pedido recente. Fotos, piano frontal e música têm pendências explicitadas no guia.
