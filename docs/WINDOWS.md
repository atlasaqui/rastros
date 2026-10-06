> Documento histórico. Para a versão atual, consulte ATUALIZACAO-ROTEIRO-COMPLETO.md; a senha do explorador é 415 e o percurso chega ao final.

# Rastros — versão Windows portátil

## Jogar

Extraia **Rastros-Windows.zip** por completo e abra **Rastros.exe** dentro da pasta extraída. Mantenha `app` e `runtime` junto dele. Não execute o EXE de dentro do ZIP nem copie apenas o EXE para outro local.

A distribuição inclui o runtime Java e JavaFX. Não exige instalação de Java, Node, Maven, navegador ou servidor. O jogo carrega seu HTML local no WebView da própria janela nativa, sem acessar localhost. Plataforma desta entrega: Windows x64.

O progresso normal é armazenado em `%LOCALAPPDATA%/Rastros/save`. O progresso do navegador é separado e não foi apagado. Para reinstalar/atualizar, mantenha essa pasta de save. A versão de desenvolvimento via Maven mantém o armazenamento anterior.

## Reconstruir

No código-fonte, com JDK 21 completo e Maven disponíveis:

1. Execute `npm install` dentro de `frontend`.
2. Execute `mvn compile` na raiz para obter as dependências Java.
3. No PowerShell, execute `./tools/package-windows.ps1`.

O script cria uma nova pasta `dist/windows-<data-hora>/app-image/Rastros`. Pode receber `-OutputDirectory`, `-JdkRoot` e `-MavenRepository`. Não remove builds existentes. A instalação de WiX não é necessária porque este pacote é um app portátil, não um instalador MSI.

O build usa `jlink` para incluir JavaFX e módulos Java, e `jpackage` para produzir o launcher Windows. `Launcher.java` é o ponto de entrada nativo. `Main.java` localiza `app/web/index.html` a partir do JAR instalado; o diretório de onde o usuário abriu o EXE não determina o caminho dos assets.

## Teste do executável

`Rastros.exe --smoke` ativa somente o teste de integração. Ele usa um save separado em `app/test-save` e grava relatório/capturas em `app/test-results`. Esses diretórios de teste não entram no ZIP distribuído. O modo normal não ativa testes nem injeta progresso.

A primeira execução do EXE foi testada a partir de outro diretório, com o percurso completo até 77E, quatro resoluções, recarga e retorno ao notebook. Resultado: `JAVA_FX_SMOKE PASS`.

O pacote de entrega também foi validado sem Java no PATH, sem JAVA_HOME e com um cache nativo novo, para conferir que usa as bibliotecas incluídas. Resultado: JAVA_FX_SMOKE PASS. O relatório final dessa execução está incluído com a entrega.

Esta entrega não é um instalador: o ZIP contém uma pasta portátil com executável e dependências locais. Não foi validada em outros sistemas operacionais ou em todas as versões do Windows.
