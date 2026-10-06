> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Testes — OS e cenários de Rastros

30/09/2026.

- `npm install --offline --no-audit --no-fund`: passou, dependências já disponíveis.
- `npm run dev`: iniciado e utilizado em 127.0.0.1:5175; encerrado antes do build final para não sobrescrever o HTML.
- `npm run build`: passou; HTML autocontido sem CDN.
- `npm test`: 16 testes passaram. Cobrem progressão, senhas, compatibilidade do save, fila de pensamentos, confirmação e ausência de gatilho inventado para vermelho.
- `mvn -o compile javafx:run -Djavafx.args=--smoke`: passou após corrigir a ligação do pensamento da pasta.
- `tools/package-windows.ps1`: gerou imagem portátil Windows x64 com runtime incluído.
- `Rastros.exe --smoke`, iniciado com diretório de trabalho em outputs: passou, código de saída 0, no build final. Usa HTML local e runtime do pacote; não depende de servidor.

O percurso real cobriu menu, diálogos, notepad físico, jornal, boot, senha incorreta/correta, transição imediata, captura das barras pretas, pensamento sobreposto, Escape durante pensamento, cinco documentos, pasta protegida, erro em pop-up, retorno, pista 77E, recarga e reentrada sem repetir boot/glitch. Aplicativos abrem/fecham e maximizam/restauram; explorador foi aberto e capturado.

LCD, janelas, botão de saída e hotspots conferidos em 1280×720, 1366×768, 1920×1080 e 820×900. Jornal foi verificado geometricamente e visualmente com arte acima do texto. Capturas finais produzidas pelo WebView real estão em `outputs/rastros-os-capturas` na entrega local.

As artes vermelhas dos três vagões foram visualizadas no navegador por parâmetro exclusivo de desenvolvimento. O vermelho não está ligado a um evento de produção. A alternativa de movimento reduzido está implementada por media query; não foi feita uma sessão separada com a preferência do Windows alterada.

O smoke usa dados isolados, sem tocar no save normal. Dados temporários de teste não entram nos ZIPs. A biblioteca de cursores JPG foi preservada, mas o jogo usa ponteiros nativos; os demais detalhes de uso de assets constam no manifesto.

Resultado do executável:

JAVA_FX_SMOKE PASS: Full route to 77E; masked login without hint; immediate black-bar glitch; queued thoughts and Escape guard; newspaper vertical layout; 5 documents; wrong/correct passwords; OS popup; apps; 4 LCD viewport bounds; reload; no repeated boot/glitch.
