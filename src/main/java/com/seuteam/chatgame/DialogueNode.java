package com.seuteam.chatgame;

/**
 * Representa uma "fala" do diálogo.
 * Ajuste os campos conforme o formato real usado no seu projeto
 * (esta é uma versão mínima só pra estrutura compilar).
 */
public class DialogueNode {

    private String text;
    private int delay;

    public DialogueNode() {
    }

    public DialogueNode(String text, int delay) {
        this.text = text;
        this.delay = delay;
    }

    public String getText() {
        return text;
    }

    public int getDelay() {
        return delay;
    }
}
