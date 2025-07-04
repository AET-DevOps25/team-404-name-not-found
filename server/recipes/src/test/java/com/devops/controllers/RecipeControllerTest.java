package com.devops.controllers;

import com.devops.entities.Difficulty;
import com.devops.entities.Recipe;
import com.devops.services.RecipeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(RecipeController.class)
class RecipeControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockitoBean
        private RecipeService recipeService;

        @Autowired
        private ObjectMapper objectMapper;

        private Recipe sampleRecipe() {
                return new Recipe(
                                UUID.randomUUID().toString(),
                                "Test Recipe",
                                Difficulty.MEDIUM,
                                30,
                                List.of("Step 1", "Step 2"),
                                List.of("Ingredient 1", "Ingredient 2"),
                                "user123");
        }

        @Test
        void generateRecipe_shouldReturnRecipe() throws Exception {
                List<String> ingredients = List.of("egg", "milk");
                Recipe recipe = sampleRecipe();

                Mockito.when(recipeService.generateRecipe(eq(ingredients), eq("user123")))
                                .thenReturn(recipe);

                mockMvc.perform(post("/ai")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(ingredients))
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Test Recipe"));
        }

        @Test
        void saveRecipe_shouldReturnCreatedRecipe() throws Exception {
                Recipe recipe = sampleRecipe();
                Mockito.when(recipeService.saveRecipe(any(Recipe.class))).thenReturn(recipe);

                mockMvc.perform(post("/")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(recipe)))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.title").value("Test Recipe"));
        }

        @Test
        void alterRecipe_shouldReturnUpdatedRecipe() throws Exception {
                Recipe recipe = sampleRecipe();
                Mockito.when(recipeService.alterRecipe(any(Recipe.class))).thenReturn(recipe);

                mockMvc.perform(put("/")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(recipe)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Test Recipe"));
        }

        @Test
        void getRecipeById_shouldReturnRecipe() throws Exception {
                Recipe recipe = sampleRecipe();
                Mockito.when(recipeService.getRecipeById(eq(recipe.getId()), eq("user123")))
                                .thenReturn(recipe);

                mockMvc.perform(get("/" + recipe.getId())
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.title").value("Test Recipe"));
        }

        @Test
        void getRecipeById_shouldReturn404IfNotFound() throws Exception {
                Mockito.when(recipeService.getRecipeById(anyString(), anyString()))
                                .thenReturn(null);

                mockMvc.perform(get("/some-id")
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isNotFound());
        }

        @Test
        void getAllRecipesForUser_shouldReturnList() throws Exception {
                Recipe recipe = sampleRecipe();
                Mockito.when(recipeService.getRecipesByUser("user123"))
                                .thenReturn(List.of(recipe));

                mockMvc.perform(get("/")
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].title").value("Test Recipe"));
        }

        @Test
        void deleteRecipe_shouldDeleteAndReturnNoContent() throws Exception {
                Recipe recipe = sampleRecipe();
                Mockito.when(recipeService.getRecipeById(eq(recipe.getId()), eq("user123")))
                                .thenReturn(recipe);

                mockMvc.perform(delete("/" + recipe.getId())
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isNoContent());
        }

        @Test
        void deleteRecipe_shouldReturn404IfRecipeNotFound() throws Exception {
                Mockito.when(recipeService.getRecipeById(anyString(), anyString()))
                                .thenReturn(null);

                mockMvc.perform(delete("/nonexistent")
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isNotFound());
        }
}
