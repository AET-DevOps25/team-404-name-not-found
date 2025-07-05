package com.devops.dto;

import lombok.Data;

import java.util.List;

@Data
public class Recipe {
    private String id;
    private String title;
    private Difficulty difficulty;
    private int cookingTime;
    private List<String> instructions;
    private List<String> ingredients;
    private String userId;
}
