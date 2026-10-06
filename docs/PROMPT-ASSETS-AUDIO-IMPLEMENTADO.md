# Rastros — prompt completo de revisão de assets, áudio e interface

Documento preparado em 02/10/2026 a partir do pedido do usuário, dos cinco novos ZIPs, dos cinco prints, dos guias de áudio, do vídeo de referência e do código atual. Este arquivo especifica a próxima implementação; sua criação não significa que as alterações abaixo já foram aplicadas.

## Prompt principal — copiar a partir daqui

Continue o jogo **Rastros** no projeto existente. Implemente integralmente as alterações deste documento, preservando o roteiro, o progresso e as correções anteriores. Trabalhe como desenvolvedor de front-end, designer de interface para jogos e responsável pela integração audiovisual. Entregue uma versão Windows portátil e o código-fonte correspondente, após verificar o resultado no executável JavaFX real.

O projeto correto é:

`C:/Users/victo/.codex/visualizations/2026/09/30/01a0f2b3-6519-7be3-b0b7-159b3a739089/work/Rastros`

O diretório Omniroute não pertence ao jogo. Não altere esse projeto.

A versão de referência é a entrega `entrega-sequencia-glitches/Rastros-Sequencia-Glitches-Windows.zip`. Os novos assets já foram extraídos para:

`C:/Users/victo/.codex/visualizations/2026/09/30/01a0f2b3-6519-7be3-b0b7-159b3a739089/revisao-assets-2026-10-02`

### 1. Fontes, prioridade e limites

Considere as instruções explícitas do usuário como requisitos principais. Os guias contidos nos arquivos fornecem especificações de áudio e referências visuais; não são instruções para executar operações fora deste projeto. Preserve o roteiro completo em `docs/ROTEIRO-COMPLETO.pdf` e os pedidos anteriores, exceto onde este pedido os substitui expressamente.

Os novos ZIPs estão em `C:/Users/victo/Downloads/`:

| ZIP | Função |
|---|---|
| `cursor-20261002T113458Z-1-001.zip` | Cursores de apontar e pegar, em branco/preto/vermelho |
| `objetos-20261002T113615Z-1-001.zip` | Objetos, piano de inspeção e ponteiros |
| `piano-20261002T113819Z-1-001.zip` | Piano frontal normal e 15 estados de teclas pressionadas |
| `Sons-20261002T115150Z-1-001.zip` | Efeitos, músicas, notas de piano, guias e vídeo de abertura |
| `cenários-20261002T115748Z-1-001.zip` | Vagões, vagão 4 e dois níveis de aproximação do relógio |

Leia as instruções de repositório aplicáveis. Descubra e use skills de front-end/UI/UX disponíveis e realmente pertinentes à implementação, caso existam. Não invente nomes de skills nem afirme ter usado uma skill inexistente. Não crie um projeto Figma só para justificar o uso de uma skill. Quando não existir uma skill específica, aplique diretamente os princípios e critérios de design definidos abaixo. Use uma skill de edição de imagens apenas se for necessário produzir variantes raster que não existam; preserve os arquivos originais.

Não reescreva o jogo do zero, não troque React/JavaFX por outro framework e não introduza dependência de servidor ou internet. Mantenha o funcionamento offline.

### 2. Auditoria obrigatória antes de substituir arquivos

Crie um manifesto com caminho, categoria, tamanho, dimensões, transparência, duração e formato de cada asset aplicável. Compare novos arquivos com os atuais. Novos arquivos não devem substituir automaticamente assets funcionais apenas por terem o mesmo nome.

Observações já verificadas:

1. `cenários/vagão dois branco.jpg` contém a sombra incorporada ao desenho. Ele não pode ser o cenário inicial sem uma composição limpa ou uma variante sem sombra.
2. Os cenários fornecidos também contêm o bloco de notas incorporado à mesa. Apenas esconder um sprite ou hotspot não remove o desenho.
3. Os cursores são PNGs RGBA de 4096×4096 com muita margem transparente. Precisam de derivados apropriados para cursor, sem destruir o original.
4. As 16 imagens do piano frontal são RGBA de 4096×3072: uma base e 15 estados pressionados.
5. O guia de piano contém oito teclas A e sete teclas B. O teclado provisório atual tem oito teclas brancas e cinco pretas; essa estrutura deve ser substituída pela arte fornecida.
6. A numeração dos arquivos de teclas segue a ordem inversa da posição visual. Use a tabela da seção do piano.
7. No inventário visual, `objetos/jornal amassado vermelho.png` mostra um notebook, apesar do nome. Trate como divergência do pacote: preserve o jornal vermelho correto já existente, se houver; não substitua pela imagem errada.
8. Os ponteiros e alguns objetos têm dimensões/margens diferentes entre variantes. Meça cada asset; não reaproveite um recorte numérico sem verificar.
9. `Sons/GUIA PIANO.png` e `Sons/8 - PUZZLES/32 - TECLAS PIANO/GUIA PIANO.png` são referências de mapeamento, não imagens para aparecer sobre o instrumento durante o jogo.

### 3. Direção visual e UI/UX

Preserve o desenho manual, o contraste seco e o terror psicológico. A interface deve parecer parte de Rastros: tipografia discreta, painéis pequenos quando necessários, bordas finas e composição sóbria. Evite transformar a exploração em um dashboard ou cobrir os cenários com cartões grandes.

Crie tokens semânticos para texto, fundo de painel, borda, foco, hover, estados desabilitados e avisos. Use um tema derivado do estado visual atual para toda a interface do mundo, inclusive diário, diálogos, localização, menu rápido, relógio e inspeções.

| Estado visual | Requisito |
|---|---|
| Branco | Texto escuro em superfícies claras ou texto claro em painel escuro realmente legível |
| Preto | Texto claro e bordas claras; remover combinações de texto escuro sobre preto |
| Vermelho | Texto claro/neutro em superfície escura; vermelho como acento, sem depender de vermelho escuro sobre preto |

Não faça apenas `filter: invert()` em toda a aplicação. Isso alteraria artes, retratos e cores do sistema operacional. Tema do cenário e skin do computador podem ser coordenados sem destruir os assets do OS.

Mire contraste de pelo menos 4,5:1 para texto normal e 3:1 para texto grande/elementos essenciais. Valide sobre o cenário real, não apenas sobre uma amostra plana. Mantenha foco visível, alvos confortáveis, acesso por teclado e nomes acessíveis em botões transparentes. Não introduza flashes agressivos novos; preserve uma alternativa com movimento reduzido mantendo os tempos narrativos.

Valide em 1280×720, 1366×768, 1920×1080 e 820×900. Mantenha proporção dos desenhos, sem esticar imagens nem deslocar hotspots quando surgirem barras de enquadramento. Posicione hotspots em coordenadas do canvas da arte, não da janela inteira.

### 4. Splash automática de aviso sonoro

Substitua a tela atual por uma splash automática de aproximadamente **1 segundo**. Conte esse segundo depois que o conteúdo estiver visível, não durante o carregamento dos assets.

Exiba um triângulo de aviso significativamente maior e em destaque, o título “Aviso sonoro” e a frase:

**“Este jogo contém sons agudos e perturbadores.”**

“Antes da viagem” pode permanecer como identificação discreta. Não exiba botão de confirmação, controle de volume, checkbox “Jogar sem som” ou instrução para ajustar o som nessa splash. Depois de um segundo, vá automaticamente para o menu.

Não toque sons perturbadores durante o aviso. Não espere uma interação para avançar. Se a pré-carga continuar, ela não deve atrasar arbitrariamente a splash nem impedir o menu de aparecer.

O menu deve manter um botão claro de **Som**, com controle de volume e opção de silenciar. As preferências devem persistir entre execuções, abranger músicas e efeitos e ser aplicadas a sons já em reprodução. Se forem adicionados controles separados de música/efeitos, mantenha também um controle global simples.

### 5. Abertura automática, sincronizada e sem “Continuar”

Remova o botão “Continuar” da tela “O que esperar de um recomeço?”. Essa abertura é uma sequência temporal automática, e não um diálogo interativo.

Use `Sons/Guia de transições.txt` como fonte dos tempos e `Sons/Guia de transição inicial.mov` como referência visual. O vídeo tem aproximadamente 21,458 segundos e inclui demonstração do menu; sua duração total não é a duração da abertura a implementar.

Há um erro de numeração no guia: “33 - ABERTURA” corresponde ao arquivo real **22 - ABERTURA (R U OK - ROCK BURWELL).wav**; “34 - ESTÁGIO 1” corresponde ao arquivo real **23 - ESTÁGIO 1 (lost forever - hallow).wav**. Faça o mapeamento pelo significado e pelo inventário. Não procure arquivos 33/34 inexistentes.

Linha do tempo a partir do clique em Novo jogo/Jogar:

| Tempo absoluto | Evento |
|---|---|
| 0,000 s | Encerrar/fazer saída da música do menu; tela preta sem texto; iniciar “4 - BUZINA TREM INÍCIO.wav” |
| 0–4 s | Permanecer em tela preta, sem botão ou nome adicional |
| 4,000 s | Iniciar o fade-in de 1 s da frase central e iniciar simultaneamente “22 - ABERTURA…” |
| 5,000 s | Frase completamente visível |
| 9,000 s | Aos 5 s da música de abertura, começar transição de 1 s da tela preta para o estágio 1 |
| 9,500 s | Aos 5,5 s da música de abertura, iniciar “23 - ESTÁGIO 1…” |
| 10,000 s | Cenário inicial completamente visível; liberar exploração sem clique extra |
| 12,000 s | Final natural dos 8 s da música de abertura, se não houver encerramento antecipado documentado |

Interprete “fade-out da tela preta” como a retirada gradual da camada preta para revelar o cenário. Não apague o cenário recém-exibido.

A buzina fornecida dura aproximadamente 4,5414 s, embora o guia use uma janela de 4 s. Preserve o gatilho do texto aos 4 s. Por padrão, deixe a cauda da buzina terminar naturalmente; isso é uma decisão de integração, não um tempo adicional escrito no guia. Não atrase o texto para 4,5414 s.

O som “9 - PENSAMENTOS-FALAS DO MURILO.wav” deve acompanhar pensamentos/falas de Murilo. Para a frase inicial, use um disparo discreto no início de sua aparição, sem mascarar a música de abertura e sem substituir os tempos documentados. Esse uso foi pedido pelo usuário; o guia não fornece um atraso separado para ele.

Use um relógio temporal único para essa sequência. Pré-carregue os sons necessários antes de iniciar sua contagem. Evite uma cadeia de timeouts independentes cujo atraso se acumula. Cancelar/abandonar uma sequência deve cancelar callbacks e sons associados. Reabrir um save durante a abertura deve restaurar uma etapa coerente sem duplicar buzina, música ou diálogo.

### 6. Estágios narrativos, cores e quatro glitches

Separe **estágio narrativo/musical** de **cor visual**. Existem cinco estágios musicais e apenas três cores. Não use a cor como única chave para escolher uma música.

Preserve a sequência aprovada anteriormente:

| Estágio | Gatilho | Cor/resultante | Música |
|---|---|---|---|
| 1 | Abertura/conclusão da introdução | Branco, sem sombra | 23 - ESTÁGIO 1 |
| 2 | Acertar a senha do usuário do computador | Preto, sem sombra | 24 - ESTÁGIO 2 |
| 3 | Acertar a senha dos arquivos | Branco, com sombra | 25 - ESTÁGIO 3 |
| 4 | Interagir com a sombra e fechar a cortina conforme o diálogo | Preto, cortina fechada e sombra ausente | 26 - ESTÁGIO 4 |
| 5 | Concluir a fuga/jogo em pixel art | Vermelho, acesso ao vagão 4 | 27 - ESTÁGIO 5 |

Uma senha incorreta dos arquivos não revela a sombra nem muda a cor. Apenas abrir a pasta também não dispara essa transição. A pista 415 deve continuar acessível antes da aparição: mantenha a alteração que libera a Bíblia após investigar a pasta protegida, evitando dependência circular.

Para cada transição, use o som correspondente e os tempos do guia:

| Transição | Som | Início da nova música a partir do início do efeito | Duração real aproximada do efeito |
|---|---|---|---|
| 1→2 | 20 - TRANSIÇÃO 1-2.wav | +2,5 s | 2,7584 s |
| 2→3 | 20 - TRANSIÇÃO 2-3.wav | +1,5 s | 1,5400 s |
| 3→4 | 20 - TRANSIÇÃO 3-4.wav | +4,0 s | 7,3219 s |
| 4→5 | 20 - TRANSIÇÃO 4-5.wav | +0,5 s | 0,7251 s |

“Após” está aqui operacionalizado como atraso desde o **início** do efeito. Os números do guia são preservados; não os some à duração do WAV. Registre essa interpretação no código/configuração.

O guia não fornece uma duração independente para todo fade visual ou fade de volume. Use os atrasos acima como marcos obrigatórios da entrada musical e da revelação do estado novo, alinhando o efeito visual a eles. Escolha curvas/fades de volume suaves, documente os valores escolhidos e trate-os como decisões de implementação, não como especificações existentes.

Em especial, a transição 3→4 tem cauda sonora longa: a música do estágio 4 entra aos 4 s, enquanto o efeito ainda termina em aproximadamente 7,322 s. Não corte esse efeito aos 4 s nem bloqueie a exploração até sua cauda terminar, salvo se o roteiro exigir bloqueio. Permita a sobreposição controlada de efeito e música.

O jumpscare usa “6 - JUMPSCARE VULTO.wav”, disparado uma única vez no instante em que a sombra é revelada após o glitch 2→3. Mantenha as falas da sombra do roteiro. Não reproduza o susto em cada render, troca de vagão ou retomada de um save que já concluiu esse encontro.

O glitch final 4→5 ocorre ao vencer a fuga em pixel art, não ao abrir o piano, descobrir a partitura ou resolver o relógio. Tentativas fracassadas/capturas não devem avançar para vermelho.

### 7. Sistema de áudio real para React + JavaFX

O código atual usa osciladores para notas/cliques e uma ponte nativa específica para um WAV do relógio. Isso não atende ao pacote novo. Integre os arquivos reais e substitua os placeholders correspondentes.

Crie um catálogo central de eventos e um serviço de áudio com:

- Reprodução única, loop quando apropriado, interrupção, volume global, categorias, fade-in/fade-out e transição entre músicas.
- Uma música de estágio principal por vez; permitir sobreposições intencionais da abertura e das caudas dos efeitos.
- Pool limitado para efeitos curtos e notas, sem alocar um reprodutor novo indefinidamente em cada hover.
- Controle de ciclo de vida: sair para o menu, trocar de cena, fechar o jogo, perder foco e iniciar novo jogo não podem deixar sons órfãos.
- Preferências aplicadas em tempo real e persistidas; silenciar não pode alterar a duração da narrativa.
- Eventos emitidos por ações/transições do jogo, e não por efeitos React acionados em todo render.
- Pré-carga apropriada para som de tecla, hover, clique, transições e sequência inicial.
- Caminhos locais funcionais em um ZIP extraído para uma pasta com espaços e acentos.

Priorize um backend nativo comprovado no JavaFX para o executável, por exemplo MediaPlayer para músicas longas e AudioClip/pool compatível para efeitos. Verifique formatos suportados e comportamento real; não suponha que Web Audio funcionará porque funciona no navegador. Mantenha fallback para a prévia web quando necessário.

Não embuta centenas de megabytes de WAV em strings base64 no JavaScript/HTML. Embale mídias como recursos locais e carregue-as por caminhos seguros. Se houver necessidade de conversão técnica para compatibilidade, preserve os originais, produza derivados rastreáveis e confira duração, volume, ausência de cortes e sincronização. Não remova caudas nem normalize silenciosamente as relações de volume criadas pelos autores.

Mapeamento mínimo dos eventos:

| Evento | Arquivo/categoria |
|---|---|
| Entrar em botão/hotspot realmente interativo | 1 - HOVER MOUSE |
| Confirmar botão comum | 2 - CLICK |
| Voltar de tela/inspeção | 3 - VOLTAR |
| Iniciar a abertura | 4 - BUZINA TREM INÍCIO |
| Trocar de vagão | 5 - TROCA DE VAGÃO |
| Aparição da sombra | 6 - JUMPSCARE VULTO |
| Visão das mãos com sangue | 7 - OLHAR MÃOS COM SANGUE |
| Fala de NPC | 8 - FALA NPC 1 / 2 / 3 |
| Pensamento/fala de Murilo | 9 - PENSAMENTOS-FALAS DO MURILO |
| Avançar diálogo | 10 - CLICK DIÁLOGO |
| Fechar diálogo | 11 - FECHAR DIÁLOGO |
| Boot real do computador | 12 - INICIALIZAÇÃO COMPUTADOR |
| Inspecionar/abrir bloco | 13 - BLOCO DE NOTAS |
| Nova anotação persistida | 14 - ANOTAR BLOCO DE NOTAS |
| Inspecionar jornal | 15 - JORNAL |
| Abrir a partitura | 16 - PARTITURA |
| Digitar no computador | 17 - TECLAR ESTÁGIO 1 / 2 / 3 |
| Validar senha correta | 18 - SENHA CORRETA |
| Validar senha incorreta | 19 - SENHA INCORRETA |
| Quatro transições | 20 - TRANSIÇÃO 1-2 / 2-3 / 3-4 / 4-5 |
| Menu | 21 - MENU PRINCIPAL (anemoia - Hehehehe).mp3 |
| Abertura | 22 - ABERTURA (R U OK - ROCK BURWELL).wav |
| Estágios 1 a 5 | Arquivos 23 a 27 em Sons/7 - MÚSICAS |
| Encerramento | Os dois arquivos 28 - ENCERRAMENTO e 28 - ENCERRAMENTO 2 |
| Alterar hora | 29 - RELÓGIO MEXER PONTEIRO HORA |
| Alterar minuto | 30 - RELÓGIO MEXER PONTEIRO MINUTO |
| Acertar 00:14 | 31 - HORA CERTA RELÓGIO |
| Piano | WAV individual A1–A8 ou B1–B7 |

Para evitar dupla reprodução, uma ação com efeito específico de diálogo/voltar não deve disparar também o clique genérico, a menos que a combinação tenha sido explicitamente escolhida e validada. Hover deve ocorrer uma vez por entrada real; mover o mouse dentro do mesmo alvo não deve repetir o efeito.

As três falas de NPC não vêm com atribuição individual a todos os personagens. Faça atribuição determinística por personagem/contexto e documente-a. Não invente uma atribuição “oficial”. Use um efeito por início de fala, sem executar o WAV inteiro a cada letra digitada.

Para os três sons de digitação, uma interpretação coerente é branco→estágio 1 de digitação, preto→estágio 2 de digitação, vermelho→estágio 3 de digitação. Essa associação é uma decisão de integração pelos três estados visuais; ela não transforma os cinco estágios musicais em três.

Os dois arquivos de encerramento têm aproximadamente 137 s e 79,5733 s. O guia não especifica seus pontos de entrada nem o papel exato da segunda versão. Verifique o roteiro e o conteúdo sonoro, registre um cue sheet e preserve ambos. Se faltar evidência para escolher entre eles, deixe a associação explicitamente pendente/configurável; não afirme que existe um tempo documentado inexistente. Não invente uma nova melodia ou novo final para resolver essa dúvida.

### 8. Cursores reais e indicação discreta de interação

Use os seis assets do ZIP de cursores:

- `cursor/cursor branco.png`, `cursor/cursor preto.png`, `cursor/cursor vermelho.png`.
- `cursor/pegar branco.png`, `cursor/pegar preto.png`, `cursor/pegar vermelho.png`.

Derive versões pequenas a partir da área útil da mão, preservando transparência e contornos. Ajuste o ponto ativo à ponta do dedo para apontar e à região de pega para agarrar. Verifique limites e suporte do cursor customizado no JavaFX. Se o cursor CSS não for confiável, implemente overlay do cursor com `pointer-events: none`, sem bloquear clicks, e fallback nativo acessível. Evite mostrar dois cursores ao mesmo tempo.

Use a variante correspondente à cor atual. A cor deve mudar no instante correto das transições e ao continuar um save. Mantenha legibilidade sobre o fundo correspondente; não assuma que uma mão branca sobre um fundo branco será legível sem considerar o contorno original.

O asset “pegar” é uma mão de agarrar/pinça, e não um desenho de mão totalmente fechada. Não invente um terceiro asset só para chamá-lo de “mão fechada”.

Defina estados coerentes:

- Alvo clicável, diálogo e passagem: cursor de apontar.
- Item recolhível e ponteiro arrastável: cursor de pegar.
- Arrasto/pressionamento: feedback de estado ativo coerente, sem trocar a cor narrativa.
- Alvo desabilitado/modal bloqueando o mundo: sem indicação falsa de disponibilidade.

A porta para o vagão 2 está parcialmente confundida com a silhueta à frente. Ajuste áreas e prioridade de interação para diferenciar “conversar” de “atravessar a porta”. Não altere apenas a legenda inferior deixando o alvo continuar ambíguo.

Ao hover/foco, destaque sutilmente o alvo com contorno/ênfase breve ou uma marca pequena perto da região. Use sprites separados dos NPCs já fornecidos quando houver correspondência exata com o cenário. Não duplique personagens que já estão desenhados no fundo. Não ilumine retângulos enormes nem deixe hotspots todos visíveis simultaneamente.

Exiba uma legenda curta junto do alvo ou do cursor, dentro do canvas e sem sair da tela, por exemplo “Vagão 2”, “Conversar” ou “Examinar”. Mantenha uma identificação discreta do vagão atual. A descoberta da porta deve funcionar por mouse e por foco do teclado, sem exigir que o jogador encontre um pixel minúsculo.

### 9. Bloco recolhido: remoção visual e pista preservada

Após clicar em “Recolher bloco de notas”:

1. Marque a posse do bloco uma única vez e salve imediatamente.
2. Remova o bloco desenhado da mesa em todas as variantes relevantes. Preserve mesa, notebook, cenário e perspectiva.
3. Desative a ação de recolher novamente; o acesso ao diário continua pela interface de posse.
4. Mantenha o bloco ausente ao voltar ao vagão, mudar de cor, abrir o notebook ou reiniciar o executável.

Como o bloco está incorporado ao JPEG, implemente uma variante real/composição fiel sem ele. Procure primeiro assets adequados nos materiais anteriores. Se não existirem, produza uma variante derivada por edição de imagem compatível com os tools/skills disponíveis, com QA visual. Um retângulo branco/preto sobre o objeto, apagando linhas da mesa, não é uma solução aceitável.

Mantenha no diário uma anotação pré-existente do objeto: **“M. Pedrosa”** e **“04/06 - motivação?”**. A anotação deve estar disponível assim que o bloco é recolhido, ser legível e continuar salva. Ela é parte do conteúdo do objeto, distinta da lista de objetivos.

Não transforme automaticamente essa pista em “senha: 04/06/2000”: preserve o texto originalmente apresentado e os outros indícios do roteiro. A senha canônica completa do usuário continua 04/06/2000; a senha dos arquivos continua 415. O bloco não pode perder a data ao ser convertido para o diário de objetivos.

Migre saves com o bloco já recolhido para incluir a anotação pré-existente sem duplicá-la ou resetar páginas, notas pessoais e objetivos.

### 10. Usuário do computador: Pedrosa

Mostre **Pedrosa** como nome do usuário na tela de login e nos locais pertinentes da sessão do OS. Preserve a identidade narrativa de Murilo; “Pedrosa” é o nome exibido na conta, não uma renomeação de todas as falas do protagonista.

Mantenha login, validação de data, sessão autenticada, senha correta/incorreta e boot funcionando. A alteração do nome não deve mudar IDs internos, save ou a senha aceita.

### 11. Relógio: arte ocupando a tela, sem modal de painel na aproximação

Substitua a apresentação atual em um painel pelo fluxo de artes em dois níveis:

**Nível 1:** no vagão 3, clicar no relógio abre `cenários/relógio vagão três branco.jpg`, `...preto.jpg` ou `...vermelho.jpg`, conforme a cor atual. Essa arte ocupa a área principal do jogo, preservando seu enquadramento. Mostre o pensamento “O relógio parece quebrado.” discretamente, com o som de Murilo apropriado. Não exiba controles de hora ou o painel “O instante” nessa etapa.

**Nível 2:** clicar novamente na região do relógio nessa arte abre `cenários/relógio zoom branco.jpg`, `...preto.jpg` ou `...vermelho.jpg` em tela inteira. O jogador passa então a manipular os ponteiros.

Não exija um terceiro botão “Manipular relógio” em um painel genérico para chegar à aproximação final. Use o próprio relógio como alvo de aprofundamento. Um acesso discreto de voltar/Esc pode existir, mas não deve transformar a arte em um cartão.

Na arte zoom, use `objetos/ponteiro grande [cor].png` para minutos e `objetos/ponteiro pequeno [cor].png` para horas. O mostrador zoom já não tem ponteiros fixos; não sobreponha duas cópias. Meça o centro e a origem de rotação por asset e calibre comprimentos/escala.

À direita, apresente somente os controles necessários, compactos e coerentes com o tema: horas, minutos e leitura `HH:MM:SS`, com segundos exibidos como `00` quando o puzzle não tiver controle de segundos. O material só fornece dois ponteiros; não invente um terceiro. A regra narrativa permanece **00:14**, sem adicionar uma condição secreta sobre segundos.

Permita arrastar os ponteiros e ajustar por campos/teclado. O ponteiro das horas acompanha a fração dos minutos. Mantenha “Confirmar horário” discreto para evitar resolver o puzzle apenas ao passar acidentalmente pelo horário correto durante um arrasto.

Tocar som de hora/minuto somente quando o valor efetivamente muda, com limitação de repetição durante arrasto. Horário errado não avança estado. Horário certo dispara uma única vez `31 - HORA CERTA RELÓGIO.wav`, cuja duração real é **5 segundos**, substituindo o som provisório e o timeout atual de 2,6 s. Faça o blackout/fade e o retorno ao vagão respeitarem esse efeito, com o encerramento da sequência no seu término. O guia não especifica subdivisões desse blackout: documente a curva visual escolhida, preservando os 5 s do som e sem cortar sua cauda.

Sair/reabrir deve preservar ajustes e solução. Continuar um save durante a resolução deve retomar ou concluir a transição coerentemente, sem reaplicar a solução ou emitir o som duas vezes.

### 12. Vagão 4 e retorno para procurar a partitura

Ao vencer a fuga em pixel art, execute a transição 4→5 e apresente o asset real **`cenários/vagão quatro alucinação.jpg`**. Identifique o local como vagão 4. Verifique posição do piano no desenho em tamanho integral e calibre seu hotspot correspondente.

Não substitua esse cenário por uma sala genérica. Não confunda o estado final com o vagão 3 apenas porque o save atual usa `currentCarId: vagao3` como implementação do final. Modele o vagão 4 de forma explícita ou implemente uma migração/identificação consistente, sem quebrar saves antigos.

Ao clicar no piano, mostre primeiro o objeto de inspeção de `objetos/piano vermelho.png` (ou a variante adequada em usos autorizados), preservando a orientação da arte. Depois, a ação de tocar abre o piano frontal do ZIP `piano`.

O jogador deve poder sair do piano antes de concluir e voltar para procurar a partitura no computador. Isso exige um caminho real de navegação/consulta. Apenas fechar o modal e deixá-lo preso no vagão final não atende ao pedido.

Ao retornar ao computador depois da fuga vencida, preserve o estágio vermelho e permita consultar a partitura/conversa/galeria já disponíveis. Não redispare a confrontação, a fuga, o último glitch ou o checkpoint de captura por causa de flags antigas de saída. Voltar ao piano deve preservar descobertas e progresso de história.

Não adicione a solução ao piano como um botão que revela automaticamente uma partitura ainda não descoberta. Se o jogador já a encontrou e ela foi legitimamente registrada, permita consultá-la respeitando essa flag. O “Consultar bloco de notas” atual que sempre exibe uma partitura técnica precisa ser revisto.

### 13. Piano frontal real: 15 teclas, imagens e sons correspondentes

Base normal: **`piano/piano.png`**. Teclas pressionadas: use as imagens entregues; não redesenhe o instrumento com botões CSS de piano tradicional.

IDs visuais conforme `GUIA PIANO.png`, da esquerda para a direita:

- Teclas inferiores/claras: A1, A2, A3, A4, A5, A6, A7, A8.
- Teclas superiores/vermelhas: B1, B2, B3, B4, B5, B6, B7.

Mapeamento verificado pelas imagens, **não pelo número do nome isoladamente**:

| ID da tecla | Imagem pressionada | Som |
|---|---|---|
| A1 | tecla apertada oito.png | A1.wav |
| A2 | tecla apertada sete.png | A2.wav |
| A3 | tecla apertada seis.png | A3.wav |
| A4 | tecla apertada cinco.png | A4.wav |
| A5 | tecla apertada quatro.png | A5.wav |
| A6 | tecla apertada três.png | A6.wav |
| A7 | tecla apertada dois.png | A7.wav |
| A8 | tecla apertada um.png | A8.wav |
| B1 | tecla pressionada sete.png | B1.wav |
| B2 | tecla pressionada seis.png | B2.wav |
| B3 | tecla pressionada cinco.png | B3.wav |
| B4 | tecla pressionada quatro.png | B4.wav |
| B5 | tecla pressionada três.png | B5.wav |
| B6 | tecla pressionada dois.png | B6.wav |
| B7 | tecla pressionada um.png | B7.wav |

Todos os sons de tecla estão em `Sons/8 - PUZZLES/32 - TECLAS PIANO/` e duram aproximadamente **5,5 segundos**. Isso é a duração da amostra, não um requisito de esperar 5,5 s entre notas.

Ao pressionar uma tecla, mostre seu estado pressionado imediatamente e toque seu WAV correspondente. Ao soltar, volte ao estado normal e deixe uma cauda sonora coerente com a amostra, sem cliques de corte. Trate pointerup, pointercancel, perda de foco e tecla do teclado liberada; nenhuma tecla pode ficar presa.

Os estados pressionados são imagens completas. Se for necessário suportar várias teclas simultâneas, componha somente as regiões alteradas de cada estado sobre a base ou use máscaras/recortes precisos. Sobrepor imagens completas com o fundo opaco do instrumento pode apagar a tecla anterior. Não atribua uma imagem ao pressionamento errado e não pisque carregando arquivos sob demanda a cada nota.

Use hotspots invisíveis aderentes às teclas desenhadas. Teclas superiores têm prioridade na região de sobreposição. Faça pré-carga dos estados e sons, preserve proporção e permita operação por mouse/teclado com feedback acessível discreto. Não imprima todos os IDs sobre a arte durante a exploração normal.

Não deduza que B1–B7 são os cinco acidentes de um piano convencional: o guia fornecido tem sete posições. IDs de áudio não são automaticamente nomes de notas musicais. Se a solução precisa ser convertida de notas para IDs, valide a correspondência pelas amostras/partitura.

O projeto ainda contém uma melodia técnica provisória `C4–E4–G4–E4–D4–C4`. O novo pacote traz o guia de teclas e os WAVs, mas não identifica uma nova sequência de solução textual no guia de transições. Preserve uma solução verificável compatível com a partitura já apresentada, ou extraia a sequência de uma partitura oficial existente; registre qualquer pendência de conteúdo. Não apresente a melodia técnica como se fosse a música oficial de encerramento.

Mantenha o final e as falas do roteiro. O sucesso do piano não deve depender de um timbre sintetizado antigo, de uma nota invisível ou de uma solução que a partitura disponível não representa.

### 14. Persistência, arquitetura e compatibilidade

Integre as mudanças nos componentes/sistemas atuais, incluindo `SoundWarning`, `MainMenu`, `App`, `SceneView`, `NotebookView`, `ClockPuzzle`, `PianoPuzzle`, `ContinuationApps`, `audioSystem`, `visualTransitionSystem`, `narrativeSystem`, `journalSystem` e a ponte Java quando necessário.

Centralize manifesto de assets, catálogo de áudio, estado narrativo e configuração de tempos. Não espalhe caminhos e números mágicos por JSX. Use callbacks estáveis para sequências temporais e limpeza de listeners/timers/reprodutores.

Salve pelo menos: estágio narrativo, cor visual, etapa pendente de transição, flags da sombra/cortina, posse do bloco, anotação original, ajustes/solução do relógio, descoberta da partitura, acesso ao vagão 4 e preferências de som. Preserve os objetivos, documentos, chats, captcha, notas pessoais, fuga e final já registrados.

Não grave referências de objetos nativos de áudio no JSON. Ao retomar, reconstrua o ambiente musical pelo estado salvo sem repetir eventos únicos concluídos. Migre saves antigos sem apagar o save real nem forçar novo jogo.

### 15. Critérios de aceite e validação

Só considere a implementação concluída após verificar:

1. Splash com triângulo grande, frase correta, nenhum controle/botão e avanço automático em cerca de 1 s.
2. Menu com preferências de som persistentes; volume/mute alteram sons em reprodução.
3. Abertura sem “Continuar”, com marcos 0/4/5/9/9,5/10/12 s observáveis em um registro de eventos.
4. Nenhum atraso da abertura causado pelo tempo de decodificação dos arquivos.
5. Quatro glitches com as músicas entrando em +2,5/+1,5/+4/+0,5 s e preservação das caudas dos efeitos.
6. Senha errada dos arquivos não mostra sombra; senha correta retorna para branco com sombra; interação fecha cortina e retorna ao preto sem figura.
7. Último glitch para vermelho somente após vitória na fuga em pixel art.
8. Cursores nas três cores, tamanho adequado, hotspot correto e troca coerente apontar/pegar.
9. Porta e NPC distinguíveis por hover/foco, sem hotspots sobrepostos capturando a ação errada.
10. Bloco desaparece da mesa nas variantes relevantes e não reaparece após recarga.
11. Texto “M. Pedrosa / 04/06 - motivação?” permanece consultável no bloco recolhido.
12. Conta do computador mostra Pedrosa e mantém a senha canônica.
13. UI legível em branco, preto e vermelho; nenhum texto essencial com contraste insuficiente.
14. Relógio abre arte de aproximação e depois arte zoom de tela inteira, com controles discretos à direita e ponteiros calibrados.
15. Horário 00:14 resolve com o WAV real de 5 s; solução, ajustes e transição persistem.
16. Vagão 4 real após a fuga, piano no local correto e inspeção antes de tocar.
17. As 15 teclas correspondem às imagens e aos WAVs corretos, sem inversão e sem teclas presas.
18. Jogador consegue sair do piano, consultar a partitura no computador e voltar sem repetir fuga/glitch final.
19. Nenhum placeholder sonoro onde existe arquivo real aplicável; nenhuma reprodução duplicada por render.
20. Novo jogo, continuidade, retorno ao menu, mute, perda de foco e interrupções não deixam timers ou sons órfãos.
21. Resoluções de teste sem cortes de controles, deformação da arte ou hotspots deslocados.
22. Percurso completo até o final no executável JavaFX, usando save de teste isolado.
23. Reabertura em etapas relevantes de introdução, glitch, relógio e vagão 4.
24. ZIP extraído em caminho com espaços/acentos funciona offline com todas as mídias.

Meça precisão de agendamento e início de reprodução no backend real. Como meta de QA, use tolerância de até 100 ms em condições normais após pré-carga, registre desvios e não prometa precisão absoluta sem medição. Essa tolerância é um critério proposto de validação, não um número do guia.

Os testes antigos esperam botões que agora deixam de existir. Atualize-os para aguardar a splash/introdução automática; não mantenha botões ocultos apenas para passar testes. Atualize também as expectativas do piano de 13 para 15 posições, do relógio para arte em tela inteira e do retorno seguro ao computador após a fuga.

### 16. Entrega

Entregue em uma pasta nova:

- ZIP Windows portátil completo, contendo runtime, executável e mídias locais necessárias.
- ZIP do código-fonte correspondente, sem node_modules, saves pessoais ou resultados de teste dentro do executável final.
- Guia curto de execução, preferências de som e comportamento do piano/relógio.
- Manifesto de assets e cue sheet final de áudio com caminhos, tempos documentados, tempos escolhidos e pendências distinguidos.
- Relatório de testes com evidências dos cenários branco/preto/vermelho, relógio, piano, remoção do bloco e navegação até a partitura.

Não declare “sem nenhum erro” apenas porque o build terminou. Informe o que foi efetivamente validado e qualquer conteúdo que ainda dependa de uma partitura/cue oficial não fornecido. Preserve as entregas anteriores para comparação.

## Prompts por etapa

As instruções acima são cumulativas. Se o trabalho for executado em etapas, use os prompts abaixo com este documento completo anexado; não remova requisitos das etapas anteriores.

### Prompt A — inventário e plano de integração

“Leia o prompt completo de Rastros de 02/10/2026 e audite todos os novos ZIPs contra o projeto atual. Produza manifesto de imagens/sons, registre as divergências 33/34 versus 22/23, a sombra/bloco incorporados nos cenários, o jornal vermelho incorreto e a ordem inversa das teclas. Defina catálogo de áudio e estados narrativos sem alterar o roteiro. Preserve os originais e documente decisões não cobertas pelos guias.”

### Prompt B — design da interface e cursores

“Implemente os temas branco/preto/vermelho e os cursores fornecidos conforme as seções 3 e 8. Corrija contraste, estados de foco e identificação dos alvos, especialmente porta/NPC do vagão 1. Faça indicações discretas integradas ao desenho. Use princípios de UI/UX para jogos, verifique quatro resoluções e preserve a skin do OS. Não cubra o cenário com cartões nem duplique silhuetas.”

### Prompt C — áudio, splash, abertura e glitches

“Implemente backend de áudio real compatível com JavaFX e catálogo de eventos. Transforme o aviso em splash automática de 1 s e mova controles para o menu. Substitua a introdução manual pela linha do tempo 0/4/5/9/9,5/10/12 s. Integre os quatro efeitos de glitch e entrada das músicas nos atrasos documentados. Preserve mute, caudas, estágio musical independente da cor, save e cancelamento de sequências.”

### Prompt D — bloco, pista e usuário Pedrosa

“Remova visualmente o bloco da mesa após recolhê-lo em todas as variantes, com arte/composição fiel e persistência. Preserve ‘M. Pedrosa / 04/06 - motivação?’ como anotação preexistente consultável no diário. Migre saves com bloco recolhido. Mude o nome exibido da conta para Pedrosa sem mudar senha ou identidade das falas.”

### Prompt E — relógio com dois níveis de arte

“Reimplemente o relógio do vagão 3 conforme a seção 11: primeiro a arte relógio vagão três na cor atual, depois a arte relógio zoom em tela inteira, ponteiros originais e controles discretos à direita. Preserve 00:14 e use o efeito real de 5 s na resolução. Elimine o painel genérico de aproximação, calibre arrasto e verifique save/retomada e quatro resoluções.”

### Prompt F — vagão 4, piano real e partitura

“Integre o vagão quatro alucinação depois da vitória na fuga. Faça inspeção do objeto antes do piano frontal. Substitua o teclado provisório pelo piano de 15 teclas e use o mapeamento verificado das imagens/WAVs. Permita sair, consultar a partitura no computador e voltar sem repetir a fuga ou o glitch final. Preserve a solução compatível com a partitura e registre qualquer conteúdo musical oficial faltante.”

### Prompt G — validação e distribuição

“Execute os critérios de aceite do prompt completo no JavaFX real, com save isolado. Atualize testes para telas automáticas, temas, cursores, relógio e piano. Verifique tempos e reprodução, reabertura, navegação e ZIP extraído em caminho com espaços. Gere Windows portátil, fontes, manifesto, cue sheet e relatório correspondentes. Relate limitações reais; não prometa ausência absoluta de erros.”

## Notas da análise realizada

- Foram inventariados os cinco ZIPs e inspecionadas visualmente suas imagens por categoria.
- Foram lidos integralmente `Lista de sons.txt` e `Guia de transições.txt`.
- Foram medidas as durações dos 53 WAVs e da música MP3; o inventário de WAVs está em `revisao-assets-2026-10-02/audios-duracoes.json`.
- O vídeo MOV foi identificado e inspecionado por quadros ao longo de sua duração. Ele serve como referência visual, não como nova linha do tempo substituindo o guia textual.
- Foram examinados os componentes atuais de áudio, piano, relógio, aviso, diário e arte para identificar diferenças de implementação.
- A análise não equivale a escuta integral e avaliação artística de todas as músicas. A implementação deverá conferir os cues e a mixagem no executável real.
- Não há no catálogo desta sessão uma skill genérica dedicada a front-end/UI/UX. O prompt exige descoberta de skills aplicáveis na implementação e inclui critérios concretos de design, sem alegar uso de skills inexistentes.
