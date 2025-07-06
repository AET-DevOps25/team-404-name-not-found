package com.devops.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AiRecipeDTO {
    private String title;
    private String description;
    private Difficulty difficulty;

    @JsonProperty("cook_time")
    private int cookingTime;
    private List<String> steps;
    private List<Ingredient> ingredients;

    @JsonProperty("needed_ingredients")
    private List<Ingredient> neededIngredients;
}
