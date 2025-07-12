package com.devops.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class RecipeDTO {
    @NotNull
    private String id;
    @NotNull
    private String title;
    @NotNull
    private String description;
    @NotNull
    private Difficulty difficulty;
    @NotNull
    private int cookingTime;
    @NotNull
    private List<@NotNull String> instructions;
    @NotNull
    private List<@NotNull Ingredient> ingredients;
    @NotNull
    private List<@NotNull Ingredient> neededIngredients;
    private String userId;
}
