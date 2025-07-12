package com.devops.dto;

import lombok.Data;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

@Data
public class AiRecipe {
    private String id;
    private String title;
    private Difficulty difficulty;

    @JsonProperty("cook_time")
    private int cookingTime;
    private List<String> steps;
    private List<Ingredient> ingredients;
    private String userId;
}
