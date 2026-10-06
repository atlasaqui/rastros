> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Verificação — diário e ícones (30/09/2026)

## Resultados

- `npm test`: 25 testes de lógica passaram. Incluem coleta idempotente após inspeção, migração de saves, condições reais de objetivos, paginação estável, apresentação persistida, textos sem códigos de resposta, máscara específica de ícones e regressões anteriores.
- `npm run build`: concluído. HTML autocontido atualizado.
- `tools/package-windows.ps1`: compilação Java e criação da aplicação Windows concluídas. Avisos existentes do Maven/JavaFX e compressão do jlink não impediram o build.
- `Rastros.exe --smoke`: PASS. Fluxo real até 77E, coleta do bloco, interrupção e retomada de escrita, Mostrar tudo, conclusão por diálogo, check/risco, cinco objetivos, três páginas, teclado, foco, Escape, bloqueio de interação com o OS, save/reload e aplicações existentes.
- `Rastros.exe --smoke-resume`: PASS em um novo processo. Diário recolhido, histórico/conclusões e página 3 preservados; sem repetir escrita, boot, glitch ou apresentar erro de gravação.
- Interface conferida em 1280×720, 1366×768, 1920×1080 e 820×900. Limites do diário e controles de paginação verificados no WebView real.
- Lixeira e Mensagens capturados ampliados sobre fundos claro e escuro; desktop conferido no tamanho real. Recortes originais preservados e processamento específico para esses dois ícones.

## Capturas

Na entrega, a pasta `diario-capturas` contém coleta, escrita, primeira página, objetivo concluído, histórico concluído, quatro resoluções, reabertura e comparação dos ícones. As capturas foram produzidas pelo executável; não são mockups.

## Limites da verificação

A preferência de movimento reduzido possui tratamento no código/CSS; não foi alterada a preferência global do Windows durante esta rodada. A arte física do bloco ainda está embutida no fundo do cenário, conforme a pendência documentada no guia. A coleta lógica e a impossibilidade de recolher novamente estão implementadas.

Os testes usaram `app/test-save`, separado do save pessoal. Essa pasta e os resultados internos dos testes não entram no ZIP jogável. A persistência normal continua em `%LOCALAPPDATA%/Rastros/save`.
