package com.devops.entities;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImageRecipeDTO {
    private String id;
    private String title;
    private String description;
    private Difficulty difficulty;
    private int cookingTime;
    private List<String> instructions;
    private List<Ingredient> ingredients;
    private List<Ingredient> neededIngredients;
    private String userId;

    public static ImageRecipeDTO fromRecipe(Recipe recipe, String description, List<Ingredient> ingredients,
            List<Ingredient> neededIngredients) {
        return new ImageRecipeDTO(
                recipe.getId(),
                recipe.getTitle(),
                description,
                recipe.getDifficulty(),
                recipe.getCookingTime(),
                recipe.getInstructions(),
                ingredients,
                neededIngredients,
                recipe.getUserId());
    }

    public Recipe toRecipe() {
        Recipe recipe = new Recipe();
        recipe.setCookingTime(this.getCookingTime());
        recipe.setDifficulty(this.getDifficulty());
        recipe.setIngredients(this.getIngredients().stream().map(ing -> ing.getName()).toList());
        recipe.setInstructions(this.getInstructions());
        recipe.setTitle(this.getTitle());
        recipe.setUserId(this.getUserId());
        return recipe;
    }
}
