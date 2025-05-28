package com.devops.controllers;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.devops.entities.users.dtos.RecipeDto;
import com.devops.services.RecipeClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class UserRecipeController {

    private final RecipeClient recipeClient;

    @GetMapping
    public List<RecipeDto> getRecipes(@RequestParam String userId) {
        return recipeClient.getRecipesForUser(userId);
    }
}
