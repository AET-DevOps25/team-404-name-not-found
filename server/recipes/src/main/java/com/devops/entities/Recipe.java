package com.devops.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    @NotNull
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull
    private Difficulty difficulty;

    @Column(nullable = false)
    @NotNull
    private int cookingTime;

    @ElementCollection
    @Column(nullable = false, columnDefinition = "TEXT")
    @NotNull
    private List<@NotNull String> instructions;

    @ElementCollection
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @NotNull
    private List<@NotNull Ingredient> ingredients;

    @ElementCollection
    @CollectionTable(name = "recipe_needed_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @NotNull
    private List<@NotNull Ingredient> neededIngredients;

    @Column(nullable = true)
    private String userId;

    public static Recipe fromAiRecipeDTO(AiRecipeDTO recipeDTO, String userId) {
        Recipe recipe = new Recipe();
        recipe.setTitle(recipeDTO.getTitle());
        recipe.setInstructions(recipeDTO.getSteps());
        recipe.setIngredients(recipeDTO.getIngredients());
        recipe.setNeededIngredients(recipeDTO.getNeededIngredients());
        recipe.setDifficulty(recipeDTO.getDifficulty());
        recipe.setCookingTime(recipeDTO.getCookingTime());
        recipe.setUserId(userId);
        return recipe;
    }
}
