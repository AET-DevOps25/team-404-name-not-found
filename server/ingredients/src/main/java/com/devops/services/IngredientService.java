package com.devops.services;

import com.devops.entities.Ingredient;
import com.devops.repositories.IngredientRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class IngredientService {

    private final IngredientRepository ingredientsRepository;

    public IngredientService(IngredientRepository ingredientsRepository) {
        this.ingredientsRepository = ingredientsRepository;
    }

    public List<Ingredient> getIngredientsByUser(String userId) {
        return ingredientsRepository.findAllByUserId(userId);
    }

    public Ingredient getIngredientById(String id, String userId) {
        Ingredient ingredient = ingredientsRepository.findById(id).orElse(null);
        if (ingredient != null && !ingredient.getUserId().equals(userId)) {
            // If the recipe exists but doesn't belong to the user, return null
            return null;
        }
        return ingredient;
    }

    public List<Ingredient> saveIngredients(List<Ingredient> ingredients) {
        return ingredientsRepository.saveAll(ingredients);
    }

    public Ingredient alterIngredient(Ingredient recipe) {
        return ingredientsRepository.save(recipe);
    }

    public void deleteIngredient(String id, String userId) {
        List<Ingredient> userIngredients = ingredientsRepository.findAllByUserId(userId);
        boolean ingredientExistsForUser = userIngredients.stream().anyMatch(r -> r.getId().equals(id));
        if (!recipeExistsForUser) {
            return;
        }
        ingredientsRepository.deleteById(id);
    }
}
