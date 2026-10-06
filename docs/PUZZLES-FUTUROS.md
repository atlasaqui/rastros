> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Puzzles reservados para continuação

| ID | Prioridade | Estado |
|---|---|---|
| notebook_login | Obrigatório | Ativo: 04/06/2000 |
| class_folder | Obrigatório | Ativo até pista/validação 77E; conteúdo pendente |
| fixo | Alta, 3 estrelas | Componente MultiTapPuzzle preparado; sem encaixe ativo |
| safe | Alta, 3 estrelas | Definição desativada; solução ainda não canônica |
| piano | Alta, 3 estrelas | Definição desativada; sem melodia inventada |
| clock | Média, 2 estrelas | Definição desativada |
| alchemy / hangman | Sem prioridade | Banco de ideias |

## FIXO

Teclas 2=ABC, 3=DEF, 4=GHI, 5=JKL, 6=MNO, 7=PQRS, 8=TUV, 9=WXYZ. F=333, I=444, X=99, O=666. Solução: 33344499666. Não aceitar 3496 como equivalente. Componente preparado com prévia, clique/teclado, confirmação explícita de letra, timeout configurável (1200 ms), apagar, reiniciar e verificação. Ciclo de toques respeita a quantidade de letras da tecla.

Faltam gatilho, lugar, origem de FIXO, wallpaper final e consequência. Para ativar: fornecer esses dados, conectar o componente à tela definida, persistir sua conclusão em solvedPuzzles e adicionar teste de integração. A lógica foi testada; o componente desativado não foi percorrido no jogo.

## Cofre

Referência favorece 1 Pedro 4:15 e código 0415 com o restante da página borrado. Alternativas na imagem: 600415, Mateus 24:9 → 402409/2409. Escolher uma só versão e fornecer a pista completa; códigos são strings para preservar zero inicial. Se houver ordem de livros, explicar edição/cânone na pista. Faltam local, conteúdo, arte e recompensa.

## Piano

Sequência configurável a partir de partitura inteira/fracionada. Entrada por mouse/teclado, retorno visual e sonoro, reinício e persistência. Não há melodia aprovada nem exigência de ritmo/ouvido absoluto. Definir notas, sons, regra de erro, pista/local e recompensa antes de ativar.

## Relógio

Ajustar hora/minuto/segundo de um relógio simulado. Definir hora correta, formato, tolerância e eventual conversão de data. Pista em jornal/arquivo é proposta, não inserção aprovada. Nunca alterar o relógio do sistema do jogador.

## Alquimia e forca

Alquimia precisa de ingredientes, receita, regras e item produzido; erro não deve consumir irreversivelmente ingrediente indispensável. Forca precisa de palavra, pista, tentativas, tratamento de acentos e recompensa; letra repetida não deve gastar tentativa por acidente. Nenhum desses dados foi inventado.
