> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Testes — entrega dos três vagões

Data: 28/09/2026. Windows, Node 22, JDK Microsoft 21 e JavaFX 21.0.2.

## Comandos executados

| Comando | Resultado |
|---|---|
| `npm install --no-audit --no-fund` em frontend | Sucesso |
| `npm run dev` em frontend | Build e servidor local iniciados; interface testada |
| `npm test` em frontend | 12 testes passaram, zero falhas |
| `npm run build` em frontend | HTML autocontido de produção gerado |
| `mvn -o compile javafx:run "-Djavafx.args=--smoke"` na raiz Java | Compilação e execução em WebView real: JAVA_FX_SMOKE PASS / BUILD SUCCESS |
| Preview do build final no navegador | Login, documentos, pasta, transformação, 77E, apps e save conferidos; sem erros/avisos de console capturados |

A execução JavaFX no ambiente restrito precisou de cache nativo em pasta gravável (`-Djavafx.cachedir=...`). A primeira tentativa falhou por acesso negado ao cache do perfil; a execução corrigida passou. Maven emitiu avisos do modelo de dependências JavaFX e do target 17 com JDK 21, sem impedir compilação/execução. Duas chamadas npm iniciais foram feitas na pasta de trabalho, sem package.json, e repetidas na pasta frontend correta.

## Percurso real no JavaFX

O teste `frontend/tests/webview-smoke.js`, iniciado exclusivamente por `--smoke`, usa o WebView real e save separado. Ele percorre:

- Novo jogo e pergunta inicial de Murilo.
- Primeira e segunda inspeção de assento.
- Casal e suspeita do Vagão 1.
- Entrada no Vagão 2 e falas iniciais dos dois passageiros.
- Descoberta da mesa, interrupção e retomada de diálogo.
- Perguntas posteriores aos dois passageiros e pensamento de esgotamento.
- Boot, login errado, saída ainda branca.
- Vagão 3 branco, jornal e os três grupos de conversa.
- Retorno, login correto por data e abertura automática dos documentos.
- Saída antecipada após autenticação: transformação preta sem marcar documentos como lidos.
- Reentrada e leitura dos cinco arquivos, na ordem.
- Pasta bloqueada e rejeição de código incorreto.
- Pensamento de saída e conversa final com 77E.
- Checkpoint e variante preta em 1280×720, 1920×1080 e 1000×800 de área do WebView.
- Recarga real da página, Continuar, checkpoint preservado, retorno ao notebook sem novo boot.

O teste verifica carregamento de todas as imagens montadas, proporção 16:9, limites dos hotspots e ausência de debug. Capturas foram inspecionadas visualmente. As dimensões foram ajustadas pela área de conteúdo do WebView, descontando as bordas da janela.

## Navegador

O build final foi percorrido da sessão salva do notebook até 77E. Testados: login por data; cinco leituras com rolagem real; pasta com 000 e 77E; saída e cenário preto; fala final; reload e continuidade; retorno sem boot; minimizar Bloco, fechar Arquivos, abrir/fechar Mensagens, E-mail e Casos; maximizar Notas e preservar texto/estado da janela após reload. O console final consultado não apresentou erros ou avisos.

A ferramenta de interação da primeira aba visível apresentou coordenadas/estados atrasados; a validação final foi feita em nova aba em segundo plano e funcionou. O servidor temporário foi encerrado durante a retomada da conversa; foi substituído por um preview local persistente do build. Não se tratava de falha no fluxo do jogo.

## Testes de lógica

12 verificações: isolamento do save legado; dados inválidos/falha de storage; retomada de diálogo; dois NPCs distintos; fase final do casal; formatos e rejeição de senhas; boot versus autenticação versus transformação; saída precoce e conclusão; 77E sem conteúdo inventado; multi-tap FIXO; ordem/repetição dos documentos; projeção dos quatro cantos do LCD em larguras diferentes.

## Problemas encontrados e corrigidos

A perspectiva 3D do LCD não se comportava igualmente no JavaFX. A área do SO foi ajustada para uma projeção afim inscrita no vidro, com margem preta e sem extravasar a moldura. O close usa a arte verdadeira do teclado e oculta o notebook já desenhado no fundo. O teste de retorno aguardava apenas o ID do vagão e foi corrigido para aguardar também o fim da saída do notebook. O save da demo foi separado para evitar pistas incompatíveis.

## Limites honestos

Não foram testados celulares físicos, sistemas operacionais diferentes, instalação Maven sem cache, sincronização de saves entre navegador/JavaFX, nem todas as combinações possíveis de janelas. FIXO não está conectado à história; apenas sua lógica foi testada, não uma etapa narrativa ativa. Os demais puzzles estão documentados, sem implementação jogável. A composição dos casais e a posição do jornal continuam decisões provisórias de arte, descritas no guia.
