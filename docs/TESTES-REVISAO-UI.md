# Verificação da revisão de interface do Rastros

## Resultado

**38 testes de lógica passaram.** O build de produção, a compilação Java e a distribuição com runtime próprio foram concluídos. O código embarcado no Windows foi comparado ao build entregue no fonte.

O executável JavaFX passou em três verificações separadas, usando exclusivamente um save de teste:

1. **Percurso completo:** novo jogo, aviso, inspeção, Bíblia, senha 415, cinco documentos escolares, relógio com confirmação 00:14, CAPTCHA, galeria e envio das três conversas, saída obrigatória, captura real, retomada, sete segmentos de fuga, retorno vermelho, piano provisório e final.
2. **Reabertura em outro processo:** final, relógio, CAPTCHA, tentativas e diário persistidos.
3. **Revisão visual e migração:** assets de inspeção e ponteiros nas três paletas, escurecimento, retomada de transição interrompida, objetivo reconciliado em save avançado, folhas escolares com rolagem e zoom proporcional, pista 00:14 legível e histórico completo do MSN restaurado.

Os relatórios originais estão em `TESTE-REVISAO-PERCURSO.txt`, `TESTE-REVISAO-REABERTURA.txt` e `TESTE-REVISAO-VISUAL.txt`.

## Dimensões e interface

Relógio, MSN, documentos e piano foram verificados em **1280×720**, **1366×768**, **1920×1080** e **820×900**. A revisão identificou um corte na composição do MSN na janela estreita; ele foi corrigido por um modo compacto baseado na altura real disponível e a verificação foi repetida com sucesso.

As capturas em `capturas-revisao-ui` mostram o aviso, os enquadramentos das mãos, as etapas do relógio, documentos e pista, histórico do MSN, objetivo concluído e final. A rolagem do leitor é intencional: as folhas conservam proporção de página e podem ser ampliadas para leitura.

## Áudio e distribuição

O efeito de relógio é um WAV original de um segundo, mono, 22050 Hz. O arquivo integra o JAR da aplicação e a ponte JavaFX faz sua reprodução. Os testes verificam o encaminhamento do volume, o silêncio e os limites das preferências; isso não constitui uma avaliação auditiva subjetiva da mixagem.

Ambos os ZIPs recebem verificação de integridade e arquivo SHA256. A distribuição exclui saves e resultados internos de teste. O progresso real do jogador não foi usado nas verificações.

## Materiais ainda provisórios

Arte frontal do piano, partitura, sequência musical e fotos definitivas da galeria continuam dependentes de materiais futuros. Os perfis e o retrato escolar usam os avatares estilizados da prancha OS fornecida. Nome da instituição, grades escolares e informações complementares dos perfis são apresentação fictícia autorizada para esta revisão.
