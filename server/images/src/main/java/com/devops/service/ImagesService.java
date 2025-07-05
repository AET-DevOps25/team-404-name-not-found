package com.devops.service;

import com.devops.dto.Ingredient;
import com.devops.dto.Recipe;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import java.util.Base64;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImagesService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String GENAI_URL = "http://genai-service/api/genai/v1/image/analyze";
    private final String RECIPES_URL = "http://recipes-service/api/recipes/ai/{numRecipes}";

    public List<Recipe> analyzeAndFetchRecipes(MultipartFile file, int numRecipes) {
        String base64Image = encodeToBase64(file);
        List<Ingredient> ingredients = callGenAi(base64Image);
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
        Map<String, String> body = new HashMap<>();
        body.put("image_base64", base64Image);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<List<Ingredient>> response = restTemplate.exchange(
                GENAI_URL,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                });

        return response.getBody();
    }

    private List<Recipe> callRecipesService(List<Ingredient> ingredients, int numRecipes) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<List<Ingredient>> entity = new HttpEntity<>(ingredients, headers);

        ResponseEntity<List<Recipe>> response = restTemplate.exchange(
                RECIPES_URL,
                HttpMethod.POST,
                entity,
                new ParameterizedTypeReference<>() {
                },
                numRecipes);

        return response.getBody();
    }
}
