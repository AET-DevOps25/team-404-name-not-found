package com.devops.services;

import com.devops.entities.Difficulty;
import com.devops.entities.Recipe;
import com.devops.repositories.RecipeRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RestTemplate restTemplate;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
        this.restTemplate = new RestTemplate();
    }

    @Value("${vars.HOST}")
    private String host;

    public Recipe generateRecipe(List<String> ingredients) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<List<String>> request = new HttpEntity<>(ingredients, headers);
            ResponseEntity<Recipe> response = restTemplate.postForEntity(
                    "http://" + host + "/api/genai/recipe", request, Recipe.class);

            return recipeRepository.save(response.getBody());
        } catch (Exception e) {
            // Fallback
            Recipe fallback = new Recipe();
            fallback.setTitle("Fallback Recipe");
            fallback.setInstructions(List.of("Mix all ingredients", "Cook for 20 minutes"));
            fallback.setIngredients(ingredients);
            fallback.setDifficulty(Difficulty.EASY);
            fallback.setCookingTime(30);
            fallback.setUserId("fallback-user-id");
            return recipeRepository.save(fallback);
        }
    }

    public List<Recipe> getRecipesByUser(String userEmail) {
        return recipeRepository.findAllByUserId(userEmail);
    }

    public Recipe getRecipeById(String id, String userEmail) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe != null && !recipe.getUserId().equals(userEmail)) {
            // If the recipe exists but doesn't belong to the user, return null
            return null;
        }
        return recipe;
    }

    public Recipe saveRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public Recipe alterRecipe(Recipe recipe) {
        return recipeRepository.save(recipe);
    }

    public void deleteRecipe(String id, String userId) {
        List<Recipe> userRecipes = recipeRepository.findAllByUserId(userId);
        boolean recipeExistsForUser = userRecipes.stream().anyMatch(r -> r.getId().equals(id));
        if (!recipeExistsForUser) {
            return;
        }
        recipeRepository.deleteById(id);
    }
}
