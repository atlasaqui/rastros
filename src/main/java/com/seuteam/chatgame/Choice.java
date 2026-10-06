package com.seuteam.chatgame;

/**
 * Representa uma opção de escolha exibida pro jogador.
 * Ajuste os campos conforme o formato real usado no seu projeto.
 */
public class Choice {

    private String text;
    private String nextNodeId;

    public Choice() {
    }

    public Choice(String text, String nextNodeId) {
        this.text = text;
        this.nextNodeId = nextNodeId;
    }

    public String getText() {
        return text;
    }

    public String getNextNodeId() {
        return nextNodeId;
    }
}
