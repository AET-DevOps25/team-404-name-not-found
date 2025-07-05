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

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping
public class RecipeController {

    private final RecipeService recipeService;

    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @Operation(summary = "Generate a recipe using AI from a list of ingredients", requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(content = @Content(mediaType = "application/json")), responses = {
            @ApiResponse(responseCode = "200", description = "Generated Recipe", content = @Content(schema = @Schema(implementation = Recipe.class)))
    })
    @PostMapping("/ai/{numRecipes}")
    public ResponseEntity<Recipe> generateRecipe(@RequestBody List<Ingredient> ingredients,
            @PathVariable int numRecipes,
            @Parameter(description = "User ID from proxy") @RequestHeader("X-User-Id") String userId) {
        Recipe recipe = recipeService.generateRecipe(ingredients, numRecipes, userId);
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

    @Operation(summary = "Get a recipe by its ID", responses = {
            @ApiResponse(responseCode = "200", description = "Recipe found", content = @Content(schema = @Schema(implementation = Recipe.class))),
            @ApiResponse(responseCode = "404", description = "Recipe not found", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"error\": \"Recipe not found\"}"))),
            @ApiResponse(responseCode = "500", description = "Missing user header", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"error\": \"The proxy should have set the user id in the Subject header\"}")))
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipeById(@PathVariable String id,
            @Parameter(description = "User ID from proxy") @RequestHeader("X-User-Id") String userId) {
        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("The proxy should have set the user id in the Subject header");
        }
        Recipe recipe = recipeService.getRecipeById(id, userId);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(recipe);
    }

    @GetMapping("/")
    public ResponseEntity<List<Recipe>> getAllRecipesForUser(@RequestHeader("X-User-Id") String userId) {
        if (userId == null || userId.isEmpty()) {
            System.out.println("The proxy should have set the user email in the Subject header");
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
        List<Recipe> recipes = recipeService.getRecipesByUser(userId);
        return ResponseEntity.ok(recipes);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecipe(@PathVariable String id, @RequestHeader("X-User-Id") String userId) {
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
