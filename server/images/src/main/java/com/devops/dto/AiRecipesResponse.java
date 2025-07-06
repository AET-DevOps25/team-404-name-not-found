package com.devops.dto;

import java.util.List;

public class AiRecipesResponse {
    private List<AiRecipe> recipes;

    public List<AiRecipe> getRecipes() {
        return recipes;
    }

    public void setRecipes(List<AiRecipe> recipes) {
        this.recipes = recipes;
    }
}
