package com.devops.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Difficulty {
    EASY("easy"),
    MEDIUM("medium"),
    ADVANCED("advanced");

    private final String difficulty;

    @JsonValue
    public String getDifficulty() {
        return difficulty;
    }

    @JsonCreator
    public static Difficulty fromValue(String value) {
        for (Difficulty difficulty : Difficulty.values()) {
            if (difficulty.difficulty.equalsIgnoreCase(value)) {
                return difficulty;
            }
        }
        throw new IllegalArgumentException("Unknown difficulty: " + value);
    }
}
