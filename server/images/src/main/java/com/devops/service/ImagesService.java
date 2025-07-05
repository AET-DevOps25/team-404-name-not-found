package com.devops.service;

import com.devops.dto.Ingredient;
import com.devops.dto.IngredientsResponse;
import com.devops.dto.Recipe;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import java.util.Base64;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImagesService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${vars.genai-url}")
    private String genaiUrl;

    @Value("${vars.recipes-url}")
    private String recipesUrl;

    public List<Recipe> analyzeAndFetchRecipes(MultipartFile file, int numRecipes) {
        String base64Image = encodeToBase64(file);
        List<Ingredient> ingredients = callGenAi(base64Image);
        System.out.println(ingredients);
        return callRecipesService(ingredients, numRecipes);
    }

    private String encodeToBase64(MultipartFile file) {
        try {
            byte[] bytes = file.getBytes();
            return Base64.getEncoder().encodeToString(bytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file", e);
        }
    }

    private List<Ingredient> callGenAi(String base64Image) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);

        HttpEntity<String> entity = new HttpEntity<>(base64Image, headers);

        ResponseEntity<IngredientsResponse> response = restTemplate.exchange(
                genaiUrl + "/image/analyze",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                });

        return response.getBody().getIngredients();
    }

    private List<Recipe> callRecipesService(List<Ingredient> ingredients, int numRecipes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Ingredient>> entity = new HttpEntity<>(ingredients, headers);

        ResponseEntity<List<Recipe>> response = restTemplate.exchange(
                recipesUrl + "/ai/" + String.valueOf(numRecipes),
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                },
                numRecipes);

        return response.getBody();
    }
}
