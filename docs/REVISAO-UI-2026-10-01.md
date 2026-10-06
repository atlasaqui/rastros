# Rastros — revisão de interface de 1 de outubro de 2026

Esta atualização aplica o documento “o relógio tem q se aproximar uma vez e vai ter o comentário.docx” e o prompt aprovado na conversa. O percurso narrativo, as pistas 415 e 00:14, o CAPTCHA, a perseguição e o final foram preservados.

## Alterações

1. **Aviso antes do menu:** triângulo amarelo com exclamação, aviso sobre sons agudos e perturbadores, ajuste de volume e opção sem som. Aparece em cada abertura do aplicativo. O menu também permite ajustar o som.
2. **Relógio em duas etapas:** primeiro clique usa os três cenários originais de aproximação e apresenta “O relógio parece quebrado.” É possível voltar ao vagão. Segundo clique mostra o mostrador e seus ponteiros com os controles na lateral direita. O horário só é validado ao confirmar. O acerto inicia escurecimento, efeito de relógio e retorno gradual ao vagão. Uma transição interrompida ao fechar o jogo é retomada.
3. **Mãos em cutscene:** enquadramento maior, entrada progressiva, pensamento na região inferior e ações “Olhar novamente”, “Seguir viagem” e “Fugir”. As imagens originais são usadas em SVG com enquadramento, sem editar os arquivos.
4. **Documentos escolares:** cinco folhas com cabeçalho de instituição fictícia, identificação, retrato de Renata, campos, assinaturas, carimbo e grades de horários. O leitor tem rolagem, indicação de página e zoom real da folha inteira. A pista 00:14 permanece na matrícula.
5. **MSN:** perfis e avatares extraídos da prancha OS original, lista de contatos, datas, horários e histórico acumulado. Respostas de Murilo aparecem na composição e avançam ao enviar. Conversas antigas completas são preservadas. O botão “Próxima mensagem” foi removido. O layout se adapta à altura real da tela do notebook.
6. **Objetivo do diário:** “Talvez uma conversa ajude a entender o que está acontecendo.” pode ser concluído pela conversa completa da Bíblia quando o percurso deixa de passar pelos dois passageiros. Saves avançados são reconciliados a partir das flags existentes. Apenas abrir uma conversa não completa o objetivo.

## Decisões de conteúdo

O nome **Colégio Santa Aurora**, a organização gráfica da secretaria, os horários e disciplinas das grades e as informações complementares dos perfis são conteúdo fictício de apresentação autorizado nesta revisão. Preservam os fatos e as falas canônicas. As datas complementares das conversas foram organizadas como 20/09, 21/09 e 22/09; não são novas pistas.

Os retratos são avatares estilizados fornecidos na prancha OS, não fotografias novas. A galeria mantém os painéis provisórios de registros e a partitura técnica, pois não foram fornecidas as fotos definitivas. O piano, sua arte frontal e a sequência C–E–G–E–D–C continuam provisórios.

O roteiro original prevê um clique no acerto do relógio, sem uma nova fala específica. O retorno usa o pensamento de apresentação já presente na versão anterior: “Um click. Os ponteiros não se movem mais.” O efeito mecânico é um WAV original gerado localmente, incluído no aplicativo e reproduzido pela ponte JavaFX; na versão web há um efeito sintetizado equivalente.

## Executar

Extraia o ZIP inteiro. Abra **Rastros.exe** mantendo as pastas `app` e `runtime` junto dele. Não é necessário instalar Java ou Node.

O progresso real permanece em `%LOCALAPPDATA%/Rastros/save`. As verificações do executável usam exclusivamente `app/test-save`, que não é distribuído. As preferências sonoras são armazenadas no perfil local do WebView.

Mouse ou Tab e Enter para interagir. Esc volta quando permitido. No relógio, ajuste horas e minutos ou arraste os ponteiros e use **Confirmar horário**. No MSN, use **Enviar** para as respostas previstas. A perseguição usa setas ou A/D. O piano mantém seus controles existentes.

## Arquivos principais

- `SoundWarning.jsx`, `MainMenu.jsx`: aviso e preferências sonoras.
- `ClockPuzzle.jsx`, `art.js`: inspeção, controles e transição do relógio.
- `HandsVision.jsx`: cutscenes das mãos.
- `SchoolDocument.jsx`, `ContinuationApps.jsx`: folhas escolares, leitor e MSN.
- `messengerSystem.js`: envio das respostas e preservação do histórico.
- `objectives.js`: conclusão do objetivo e reconciliação pelo sistema do diário.
- `revision.css`: apresentação e adaptação às dimensões disponíveis.
- `JavaBridge.java`, `audio/clock.wav`: reprodução nativa do efeito de relógio.

Os documentos das entregas anteriores permanecem como histórico. Este guia descreve a revisão atual.
