# Revisão de interface e perseguição — 02/10/2026

Interface noir com fichas de objetivo, etiquetas, cantos de seleção e contraste invertido por cenário. Chat e computador conservam seus estilos. Cursor preto no branco e branco no preto, recorte transparente preservado e tamanho maior. Ponto vermelho compartilhado entre título inicial e créditos.

Anotação original corrigida para `04/06/2000 - motivação?`; migração troca apenas a pista original reconhecida, preservando texto personalizado.

## Vagão 3
O interlocutor à mesa corresponde às silhuetas tristes; o homem em primeiro plano à esquerda corresponde à Silhueta Isolada 3; a silhueta ao fundo à direita corresponde à Silhueta Isolada 4. A cabeça adicional ao fundo à esquerda permanece parte da composição, sem uma quarta conversa inventada. Falas canônicas preservadas.

## Abertura
Sons do trem, pensamento e início da trilha permanecem em 0, 4 e 9,5 segundos. Aos 10 segundos aparece o pensamento de acomodar-se. A exploração começa aos 14 segundos: foram acrescentados 4 segundos para apresentar automaticamente a frase com leitura confortável, sem botão de avanço.

## Perseguição
Assets extraídos do ZIP fornecido. Sprites de personagem/vulto recortados na mesma caixa de 155 × 212 px. Mãos alinhadas em 685 × 217 px; cenário preserva 2160 × 3840 e sua proporção vertical. Nenhuma imagem foi gerada artificialmente. Os sprites já têm a cabeça orientada para a parte superior; preservamos essa orientação e movimentamos os personagens para cima sem inverter o mundo.

Cinco vagões. WASD/setas; diagonais normalizadas. Entrada de 0,8 segundo, transição de 0,75 segundo e espera do vulto de 2 segundos ativos em cada trecho. Dificuldade configurável em `escapeSystem.js`: 1 a 5 mãos, vulto de 78 a 94 unidades/segundo, jogador 145. Ataques sinalizam, estendem, agarram e retraem; cada mão atinge apenas metade do corredor, com alturas separadas e rota oposta livre. Captura apresenta “Não existe recomeço.” por 3 segundos e retorna ao computador. Vitória aciona o glitch vermelho e mantém o percurso até o piano.

Checkpoint de simulação a cada 250 ms. Retomada pelo menu entra pausada para evitar captura enquanto o jogador se prepara. Tempo fora da aplicação não avança ameaças. Saves antigos da fuga anterior reiniciam apenas a tentativa, preservando a investigação.

## Pausa e persistência
Menu interno oferece continuar, volume, mute e retorno confirmado. A pausa congela todos os relógios da perseguição. Trilha ambiente continua durante o ajuste de volume, sem duplicação de reprodução. Proteção nativa desabilita contexto do WebView e F5/Ctrl+R/Ctrl+Shift+R. Estado carregado nunca é substituído por nova partida sem confirmação.

## Áudio e final
Efeito das mãos usa ganhos narrativos fixos: 0,38, 0,62 e 0,78; multiplicados pelo volume global e respeitando mute. Eventos identificados persistem para não escalar por reabertura. Final: “Eu não queria isso. Eu nunca quis isso.”, com identificação de Murilo; fade de 1,5 segundo, conversa canônica e créditos. Faixa final contínua de 137 segundos preservada.

A validação sonora verifica pedidos, ganhos, mute e continuidade do player nativo; não equivale a uma avaliação auditiva subjetiva da mixagem.

Medição técnica dos arquivos: efeito 7 com pico -2,2 dBFS e música 28 com pico -5,3 dBFS. Os ganhos finais de 0,78 e 0,45 mantêm um limite conservador combinado de aproximadamente 0,85 da amplitude máxima, mesmo com volume global em 100%.

As transições usam o instante inicial salvo como referência absoluta. O tempo de preparação do áudio nativo não é somado à duração do glitch; a música seguinte respeita o prazo mesmo quando um efeito demora a carregar.

O prazo dos glitches é verificado por quadro, com temporizador de segurança e encerramento único. A ruptura usa menos camadas e um fundo opaco; durante a transição dos arquivos, o computador permanece montado e preserva seu estado, mas fica oculto para reduzir a composição do WebView. O teste de tempo desse intervalo dispensa captura forçada da tela.
