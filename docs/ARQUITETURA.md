# Arquitetura de Rastros

> Os arquivos de dados e testes podem conter soluções e acontecimentos da história.

## Aplicação e ponte

`src/main/java/com/seuteam/chatgame/Main.java` cria a WebView, instala `window.bridge` e carrega o build local. `JavaBridge.java` expõe operações usadas pela interface. `NativeAudio.java` controla vozes e efeitos. `SaveStore.java` organiza o armazenamento nativo. `Launcher.java` inicia a aplicação empacotada.

`frontend/src/main.jsx` espera a ponte na execução por arquivo e monta o React. `App.jsx` coordena contextos de jogo, modais e progressão. A fonte de verdade do estado é o save; componentes recebem o estado e atualizações.

## Onde configurar

| Conteúdo | Local |
|---|---|
| Cenários e hotspots | `frontend/src/data/scenes.js` |
| Progressão narrativa e objetivos imediatos | `frontend/src/systems/narrativeSystem.js` |
| Conversas e documentos da continuação | `frontend/src/data/continuation.js` |
| Condições da continuação e leitura do MSN | `frontend/src/systems/continuationSystem.js` |
| Catálogo de flags | `frontend/src/data/flags.js` |
| Objetivos do caderno | `frontend/src/data/objectives.js` |
| Atualização das anotações | `frontend/src/systems/journalSystem.js` |
| Notas e sequência do piano | `frontend/src/data/piano.js` |
| Áreas das teclas | `frontend/src/data/pianoRegions.js` |
| Física da perseguição | `frontend/src/systems/escapeSystem.js` |
| Música e efeitos | `frontend/src/systems/audioSystem.js`, `frontend/src/data/audioCatalog.js` |
| Persistência e migração | `frontend/src/save/saveSystem.js` |
| Imagens e posições | `frontend/src/data/art.js`, `mediaAssets.js`, `mediaBounds.js` |

## Acrescentar um cenário

Adicione as imagens às pastas de assets usadas pelo projeto. Registre o cenário em `scenes.js`, com identificador único, rótulo, backgrounds para as variações e hotspots. As posições dos hotspots são percentuais da imagem. Configure as condições de acesso no sistema narrativo; adicionar uma imagem não cria automaticamente uma etapa de progressão.

## Acrescentar um passageiro

Registre uma área do tipo NPC com o identificador do personagem. Adicione as falas no conjunto narrativo correspondente e uma regra de encontro em `narrativeSystem.js`. Use os assets reais da equipe. Se houver uma arte provisória, marque-a explicitamente com `TODO ART`.

## Acrescentar uma conversa arquivada

Adicione o contato e as linhas no catálogo da continuação. Atualize o perfil visual no Messenger e as condições de leitura quando necessário. Histórico arquivado não deve usar envio ou respostas em tempo real. Verifique se listas de contatos obrigatórios precisam mudar.

## Acrescentar um puzzle

Crie a regra de validação no sistema pertinente e a interação visual em um componente. Grave conclusão e condições por flags ou pelo estado específico do puzzle. Adicione migração para novos campos do save, condições de desbloqueio e um teste que cubra sucesso, falha e persistência. Não marque conclusão apenas ao abrir a interface.

## Save e áudio

O save JavaScript tem chave própria e normaliza campos antigos. No pacote Windows a ponte grava progresso em `%LOCALAPPDATA%/Rastros/save`. Não envie saves pessoais ao repositório.

O catálogo de áudio mantém os IDs e arquivos. A interface solicita reprodução à ponte nativa; existe fallback web para desenvolvimento. O piano silencia o ambiente enquanto está aberto; a conclusão inicia a sequência final. Os quinze sons de teclas são vinculados aos nomes musicais pelo catálogo do piano.

## Builds

`npm run build` executa `frontend/tools/portable.mjs`: esbuild compila JSX/CSS e copia recursos para `src/main/resources/web`. Maven compila Java. O empacotador monta o aplicativo com seus recursos e um runtime JavaFX. Os derivados web são gerados, não fonte autoral.
