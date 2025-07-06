package com.devops.entities;

import jakarta.persistence.*;
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
    private String title;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column(nullable = false)
    private int cookingTime;

    @ElementCollection
    @Column(nullable = false, columnDefinition = "TEXT")
    private List<String> instructions;

    @ElementCollection
    @Column(nullable = false)
    private List<String> ingredients;

    @Column(nullable = false)
    private String userId;

    public static Recipe fromAiRecipeDTO(AiRecipeDTO recipeDTO, String userId) {
        Recipe recipe = new Recipe();
        recipe.setTitle(recipeDTO.getTitle());
        recipe.setInstructions(recipeDTO.getSteps());
        recipe.setIngredients(recipeDTO.getIngredients().stream().map(ingredient -> ingredient.getName()).toList());
        recipe.setDifficulty(recipeDTO.getDifficulty());
        recipe.setCookingTime(recipeDTO.getCookingTime());
        recipe.setUserId(userId);
        return recipe;
    }
}
