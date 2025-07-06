package com.devops.services;

import com.devops.entities.AiRecipeRequest;
import com.devops.entities.ImageRecipeDTO;
import com.devops.entities.Ingredient;
import com.devops.entities.Recipe;
import com.devops.entities.AiRecipeDTO;
import com.devops.entities.RecipeResponseDTO;
import com.devops.repositories.RecipeRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RestTemplate restTemplate;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
        this.restTemplate = new RestTemplate();
    }

    @Value("${vars.ai-host}")
    public String host;

    public List<ImageRecipeDTO> generateRecipe(List<Ingredient> ingredients, int numRecipes, String userId) {

        System.out.println("Recipes service making request to ai service");
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            AiRecipeRequest aiRecipeRequest = new AiRecipeRequest(ingredients);
            HttpEntity<AiRecipeRequest> request = new HttpEntity<>(aiRecipeRequest, headers);
            ResponseEntity<RecipeResponseDTO> response = restTemplate.postForEntity(
                    "http://" + host + "/api/genai/v1/recipe/matching/" + String.valueOf(numRecipes), request,
                    RecipeResponseDTO.class);

            System.out.println("AI service response: " + response.getBody().getRecipes());

            List<ImageRecipeDTO> recipes = new ArrayList<>();
            for (AiRecipeDTO recipeDTO : response.getBody().getRecipes()) {
                Recipe toSave = Recipe.fromAiRecipeDTO(recipeDTO, userId);
                recipeRepository.save(toSave);

                ImageRecipeDTO imageRecipeDTO = ImageRecipeDTO.fromRecipe(toSave, userId, ingredients,
                        recipeDTO.getNeededIngredients());
                recipes.add(imageRecipeDTO);
            }
            return recipes;
        } catch (Exception e) {
            System.out.println("Something went horribly wrong! " + e);
            // Fallback
            return new ArrayList<ImageRecipeDTO>();
        }
    }

    public List<Recipe> getRecipesByUser(String userId) {
        return recipeRepository.findAllByUserId(userId);
    }

    public Recipe getRecipeById(String id, String userId) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe != null && !recipe.getUserId().equals(userId)) {
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
