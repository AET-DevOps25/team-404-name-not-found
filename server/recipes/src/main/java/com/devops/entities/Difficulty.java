package com.devops.entities;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Difficulty {
    EASY("easy"),
    MEDIUM("medium"),
    ADVANCED("advanced");

    private final String difficulty;

    public String getDifficulty() {
        return difficulty;
    }
}
