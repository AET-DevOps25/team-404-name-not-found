package com.devops.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class RecipeDTO {
    private String id;
    private String title;
    private String description;
    private Difficulty difficulty;
    private int cookingTime;
    private List<String> instructions;
    private List<Ingredient> ingredients;
    private List<Ingredient> neededIngredients;
    private String userId;
}
