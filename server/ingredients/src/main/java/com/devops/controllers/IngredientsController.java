package com.devops.controllers;

import com.devops.entities.Ingredient;
import com.devops.services.IngredientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping
public class IngredientsController {

    private final IngredientService ingredientService;

    @Value("${vars.mode}")
    private String mode;

    public IngredientsController(IngredientService ingredientService) {
        this.ingredientService = ingredientService;
    }

    @PostMapping("/")
    public ResponseEntity<List<Ingredient>> saveIngredients(@RequestBody List<Ingredient> ingredients,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        final String configuredUserId = configureUserId(userId);
        ingredients.forEach(ingredient -> ingredient.setUserId(configuredUserId));

        List<Ingredient> savedIngredients = ingredientService.saveIngredients(ingredients);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIngredients);
    }

    @PutMapping("/")
    public ResponseEntity<Ingredient> alterIngredient(@RequestBody Ingredient ingredient,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);
        ingredient.setUserId(userId);

        Ingredient updatedIngredient = ingredientService.alterIngredient(ingredient);
        return ResponseEntity.ok(updatedIngredient);
    }

    @Operation(summary = "Get an ingredient by its ID", responses = {
            @ApiResponse(responseCode = "200", description = "Ingredient found", content = @Content(schema = @Schema(implementation = Ingredient.class))),
            @ApiResponse(responseCode = "404", description = "Ingredient not found", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"error\": \"Ingredient not found\"}"))),
            @ApiResponse(responseCode = "500", description = "Missing user header", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"error\": \"The proxy should have set the user id in the Subject header\"}")))
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getIngredientById(@PathVariable String id,
            @Parameter(description = "User ID from proxy") @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);

        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("The proxy should have set the user id in the Subject header");
        }
        Ingredient ingredient = ingredientService.getIngredientById(id, userId);
        if (ingredient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(ingredient);
    }

    @GetMapping("/")
    public ResponseEntity<List<Ingredient>> getAllIngredientsForUser(
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);

        if (userId == null || userId.isEmpty()) {
            System.out.println("The proxy should have set the user email in the Subject header");
            return ResponseEntity.internalServerError().body(new ArrayList<>());
        }
        List<Ingredient> ingredients = ingredientService.getIngredientsByUser(userId);
        return ResponseEntity.ok(ingredients);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteIngredient(@PathVariable String id,
            @RequestHeader(value = "X-User-Id", required = false) String userId) {

        userId = configureUserId(userId);

        if (id == null || id.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (userId == null || userId.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("The proxy should have set the user email in the Subject header");
        }
        Ingredient ingredient = ingredientService.getIngredientById(id, userId);
        if (ingredient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        ingredientService.deleteIngredient(id, userId);
        return ResponseEntity.noContent().build();
    }

    private String configureUserId(String userId) {
        String result = userId;
        if (mode.equalsIgnoreCase("dev")) {
            result = Optional.ofNullable(userId).orElse("dev-user");
        }
        if (result == null || result.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                "The proxy should have set the user id in the X-User-Id header");
        }
        return userId;
    }
}
