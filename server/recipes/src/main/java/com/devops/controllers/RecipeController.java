package com.devops.controllers;

import com.devops.entities.Ingredient;
import com.devops.entities.Recipe;
import com.devops.services.RecipeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
public class RecipeController {

    private final RecipeService recipeService;

    @Value("${vars.mode}")
    private String mode;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @Operation(summary = "Generate a recipe using AI from a list of ingredients. The result will try its best to match your given ingredient list", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(mediaType = "application/json")), responses = {
            @ApiResponse(responseCode = "200", description = "Generated Recipe", content = @Content(schema = @Schema(implementation = Recipe.class)))
    })
    @PostMapping("/ai/match/{numRecipes}")
    public ResponseEntity<List<Recipe>> generateRecipe(@RequestBody List<Ingredient> ingredients,
            @PathVariable int numRecipes,
            @Parameter(description = "User ID from proxy") @RequestHeader(value = "X-User-Id", required = false) String userId) {
        userId = configureUserId(userId);

        List<Recipe> recipes = recipeService.generateRecipe(ingredients, numRecipes, userId);
        return ResponseEntity.ok(recipes);
    }

    @Operation(summary = "Generate a recipe using AI from a list of ingredients. The AI can experiment with your given ingredient list, leading to potential recipes you can't cook right away", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(mediaType = "application/json")), responses = {
            @ApiResponse(responseCode = "200", description = "Generated Recipe", content = @Content(schema = @Schema(implementation = Recipe.class)))
    })
    @PostMapping("/ai/explore/{numRecipes}")
    public ResponseEntity<List<Recipe>> exploreRecipe(@RequestBody List<Ingredient> ingredients,
            @PathVariable int numRecipes,
            @Parameter(description = "User ID from proxy") @RequestHeader(value = "X-User-Id", required = false) String userId) {
        userId = configureUserId(userId);

        List<Recipe> recipes = recipeService.exploreRecipe(ingredients, numRecipes, userId);
        return ResponseEntity.ok(recipes);
    }

    @PostMapping("/")
    public ResponseEntity<Recipe> saveRecipe(@RequestBody Recipe recipe,
            @Parameter(description = "User ID from proxy") @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);
        recipe.setUserId(userId);

        Recipe savedRecipe = recipeService.saveRecipe(recipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecipe);
    }

    @PutMapping("/")
    public ResponseEntity<Recipe> alterRecipe(@RequestBody Recipe recipe,
            @Parameter(description = "User ID from proxy") @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);
        recipe.setUserId(userId);

        Recipe updatedRecipe = recipeService.alterRecipe(recipe);
        return ResponseEntity.ok(updatedRecipe);
    }

    @Operation(summary = "Get a recipe by its ID", responses = {
            @ApiResponse(responseCode = "200", description = "Recipe found", content = @Content(schema = @Schema(implementation = Recipe.class))),
            @ApiResponse(responseCode = "404", description = "Recipe not found", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"error\": \"Recipe not found\"}"))),
            @ApiResponse(responseCode = "500", description = "Missing user header", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"error\": \"The proxy should have set the user id in the Subject header\"}")))
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable String id,
            @Parameter(description = "User ID from proxy") @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);

        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Recipe recipe = recipeService.getRecipeById(id, userId);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(recipe);
    }

    @GetMapping("/")
    public ResponseEntity<List<Recipe>> getAllRecipesForUser(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);

        List<Recipe> recipes = recipeService.getRecipesByUser(userId);
        return ResponseEntity.ok(recipes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);

        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Recipe recipe = recipeService.getRecipeById(id, userId);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        recipeService.deleteRecipe(id, userId);
        return ResponseEntity.noContent().build();
    }

    private String configureUserId(String userId) {
        String result = userId;
        if (mode.equalsIgnoreCase("dev")) {
            result = Optional.ofNullable(userId).orElse("dev-user");
        }
        if (result == null || result.isEmpty()) {
            throw new RuntimeException("The proxy should have set the user id in the X-User-Id header");
        }
        return userId;
    }
}
