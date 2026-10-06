package com.seuteam.chatgame;

import java.util.List;

/**
 * Motor de diálogo — controla o nó atual, avança a conversa e
 * repassa as mensagens/escolhas pro JavaBridge exibir na UI React.
 *
 * Este arquivo é um esqueleto: substitua pela sua implementação real
 * (carregamento dos diálogos em src/main/resources/dialogues, lógica
 * de ramificação, etc.). A parte importante pra integração com o React
 * é: sempre que o diálogo avançar, chame bridge.dispatchMessage(...)
 * e/ou bridge.dispatchChoices(...).
 */
public class DialogueEngine {

    private JavaBridge bridge;

    public void setBridge(JavaBridge bridge) {
        this.bridge = bridge;
    }

    /** Inicia o diálogo a partir do nó raiz. */
    public void start() {
        // TODO: carregar o primeiro DialogueNode e chamar bridge.dispatchMessage(node)
    }

    /** Chamado pelo JavaBridge quando o jogador escolhe uma opção no React. */
    public void selectChoice(int index) {
        // TODO: usar o índice pra decidir o próximo nó do diálogo,
        // então chamar bridge.dispatchMessage(...) e/ou bridge.dispatchChoices(...)
    }

    private void showChoices(List<Choice> choices) {
        if (bridge != null) {
            bridge.dispatchChoices(choices);
        }
    }
}
