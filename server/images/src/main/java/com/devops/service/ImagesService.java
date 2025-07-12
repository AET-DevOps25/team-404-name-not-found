package com.devops.service;

import com.devops.dto.Ingredient;
import com.devops.dto.IngredientsResponse;
import com.devops.dto.RecipeDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import java.util.Base64;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ImagesService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${vars.genai-url}")
    private String genaiUrl;

    @Value("${vars.recipes-url}")
    private String recipesUrl;

    @Value("${vars.ingredients-url}")
    private String ingredientsUrl;

    public List<RecipeDTO> analyzeAndFetchRecipes(MultipartFile file, int numRecipes, String userId,
            String aiEndpoint) {
        String base64Image = encodeToBase64(file);
        List<Ingredient> ingredients = callGenAi(base64Image);
        saveIngredients(ingredients, userId);
        return callRecipesService(ingredients, numRecipes, userId, aiEndpoint);
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

    private void saveIngredients(List<Ingredient> ingredients, String userId) {

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("X-User-Id", userId);

        HttpEntity<List<Ingredient>> entity = new HttpEntity<>(ingredients, headers);

        ResponseEntity<List<Ingredient>> response = restTemplate.exchange(
                ingredientsUrl + "/",
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                });

        System.out.println("saved these ingredients: " + response.getBody());
    }

    private List<RecipeDTO> callRecipesService(List<Ingredient> ingredients, int numRecipes, String userId,
            String aiEndpoint) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("X-User-Id", userId);

        HttpEntity<List<Ingredient>> entity = new HttpEntity<>(ingredients, headers);

        System.out.println("Sending off request to recipes service...");

        ResponseEntity<List<RecipeDTO>> response = restTemplate.exchange(
                recipesUrl + "/ai" + aiEndpoint + String.valueOf(numRecipes),
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                },
                numRecipes);

        return response.getBody();
    }
}
