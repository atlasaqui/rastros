> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Validação — Rastros

29/09/2026. Windows, Node 22.23.2, JDK Microsoft 21, JavaFX 21.0.2.

| Verificação | Resultado |
|---|---|
| `npm install --no-audit --no-fund` | Sucesso |
| `npm run dev` | Servidor executado e interface acessada na porta 5174 |
| `npm test` | 13 testes passaram |
| `npm run build` | HTML autocontido gerado com título Rastros |
| `mvn -o compile javafx:run "-Djavafx.args=--smoke"` | JAVA_FX_SMOKE PASS / BUILD SUCCESS no build final |
| Navegador | Login, interação nas aplicações, notas, maximização, redimensionamento, reload e variantes conferidos |

## Fluxo real JavaFX

O teste usa armazenamento separado do jogo normal. Percorre Novo jogo, diálogos dos três vagões, inspeções, boot, senha errada, login 04/06/2000, saída antecipada, transformação preta, reentrada, leitura dos cinco documentos, tentativa de pasta, revelação de 77E, checkpoint, recarga e retorno sem novo boot. Abre, maximiza, restaura e fecha Mensagens, E-mail, Casos e Notas.

As variantes branca e preta do close foram medidas em 1280×720, 1366×768, 1920×1080 e 1000×800. Foram verificadas proporção da moldura, limites do LCD, ausência de transformação inclinada, limites das janelas acima da barra de tarefas e hit test do botão de saída. Capturas foram inspecionadas. O teste final foi repetido após o pedido de ampliar o notebook e mostrar o cenário ao fundo.

## Navegador

O build foi testado no navegador integrado, incluindo restauração de sessão, login, edição de notas, maximização e mudança para 1000×800. O texto de teste e a maximização sobreviveram ao reload. A saída após autenticação mudou o cenário para preto e a reentrada apresentou a moldura preta com o vagão correspondente ao fundo. A consulta final de logs não retornou avisos ou erros.

## Regressão de lógica

13 testes cobrem compatibilidade de saves, dados inválidos, persistência de diálogos, NPCs distintos, login canônico, boot versus transformação, saída precoce, limite narrativo de 77E, FIXO inativo, preservação dos documentos, limites das janelas antigas e dados salvos antes do rebranding.

## Ocorrências corrigidas

Uma instância antiga do servidor ocupava a porta 5173 e recompilava o HTML com o título anterior. Ela foi encerrada; o build foi regenerado e o teste de título passou. A primeira tentativa de dev nessa porta falhou por conflito; a execução em 5174 funcionou. Uma captura inicial do menu foi feita antes da montagem React: o teste agora espera o botão do menu antes de capturar.

Maven emite avisos preexistentes sobre o modelo de dependências JavaFX e compilação target 17 com JDK 21; a execução terminou com sucesso. O ambiente restrito usa `JAVA_TOOL_OPTIONS=-Djavafx.cachedir=...` apontando para cache gravável.

## Limites

Não foram testados celulares físicos, outros sistemas operacionais ou todas as combinações de aplicativos. Os quatro tamanhos listados são áreas efetivas do WebView. Após o pedido seguinte de incluir o executável na próxima entrega, foi preparada uma distribuição Windows portátil; a validação específica está em WINDOWS.md. FIXO e os demais puzzles futuros continuam fora do fluxo jogável autorizado.

## Executável Windows final

Rastros.exe foi executado diretamente pelo Windows, de um diretório diferente, com runtime próprio. O teste percorreu a história até 77E e terminou com PASS. A cópia de entrega repetiu o teste com PATH sem Java, JAVA_HOME vazio e cache nativo novo; 52 DLLs foram extraídas do runtime incluído, e o fluxo também passou. O teste usa save isolado. Relatório: TESTE-EXECUTAVEL-RASTROS.txt. O menu sem as duas frases e o objetivo “Investigue o computador.” foram conferidos nas capturas do executável.
