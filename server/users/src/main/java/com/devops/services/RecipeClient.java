package com.devops.services;

import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.devops.entities.users.dtos.RecipeDto;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipeClient {

    private final RestTemplate restTemplate;
    private static final String RECIPES_SERVICE_URL = "http://recipes:8081/recipes";

    public List<RecipeDto> getRecipesForUser(String userId) {
        try {
            String url = RECIPES_SERVICE_URL + "?userId=" + userId;
            RecipeDto[] recipes = restTemplate.getForObject(url, RecipeDto[].class);
            return recipes != null ? Arrays.asList(recipes) : List.of();
        } catch (Exception e) {
            // Temporary fallback: return dummy data
            return List.of(
                    new RecipeDto("Dummy Pancakes", List.of("Flour", "Eggs", "Milk")),
                    new RecipeDto("Dummy Salad", List.of("Lettuce", "Tomato", "Cucumber")));
        }
    }
}
