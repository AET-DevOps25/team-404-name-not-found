package com.devops.controllers;

import com.devops.entities.Recipe;
import com.devops.services.RecipeService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping("/ai")
    public ResponseEntity<Recipe> generateRecipe(@RequestBody List<String> ingredients,
            @RequestHeader("X-User-Id") String userId) {
        Recipe recipe = recipeService.generateRecipe(ingredients, userId);
        return ResponseEntity.ok(recipe);
    }

    @PostMapping("/")
    public ResponseEntity<Recipe> saveRecipe(@RequestBody Recipe recipe) {
        Recipe savedRecipe = recipeService.saveRecipe(recipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecipe);
    }

    @PutMapping("/")
    public ResponseEntity<Recipe> alterRecipe(@RequestBody Recipe recipe) {
        Recipe updatedRecipe = recipeService.alterRecipe(recipe);
        return ResponseEntity.ok(updatedRecipe);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable String id, @RequestHeader("X-User-Id") String userId) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("The proxy should have set the user email in the Subject header");
        }
        Recipe recipe = recipeService.getRecipeById(id, userId);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(recipe);
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllRecipesForUser(@RequestHeader("X-User-Id") String userId) {
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("The proxy should have set the user email in the Subject header");
        }
        List<Recipe> recipes = recipeService.getRecipesByUser(userId);
        return ResponseEntity.ok(recipes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable String id, @RequestHeader("X-User-Id") String userId) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("The proxy should have set the user email in the Subject header");
        }
        Recipe recipe = recipeService.getRecipeById(id, userId);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        recipeService.deleteRecipe(id, userId);
        return ResponseEntity.noContent().build();
    }
}
