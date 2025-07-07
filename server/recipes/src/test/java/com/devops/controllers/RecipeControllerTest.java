package com.devops.controllers;

import com.devops.entities.Difficulty;
import com.devops.entities.Ingredient;
import com.devops.entities.Recipe;
import com.devops.entities.Unit;
import com.devops.services.RecipeService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
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

        private List<Recipe> sampleRecipe() {
                return List.of(new Recipe(
                                UUID.randomUUID().toString(),
                                "Test Recipe",
                                Difficulty.MEDIUM,
                                30,
                                List.of("Step 1", "Step 2"),
                                List.of(new Ingredient("1", 1, Unit.G)),
                                List.of(new Ingredient("1", 1, Unit.G)),
                                "user123"));
        }

        @Test
        void generateRecipe_shouldReturnRecipe() throws Exception {
                List<Ingredient> ingredients = new ArrayList<>();
                int numRecipes = 1;
                List<Recipe> recipes = sampleRecipe();

                Mockito.when(recipeService.generateRecipe(eq(ingredients), eq(numRecipes), eq("user123")))
                                .thenReturn(recipes);

                mockMvc.perform(post("/ai/match/" + numRecipes)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(ingredients))
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isOk());
        }

        @Test
        void saveRecipe_shouldReturnCreatedRecipe() throws Exception {
                List<Recipe> recipes = sampleRecipe();
                Mockito.when(recipeService.saveRecipe(any(Recipe.class))).thenReturn(recipes.getFirst());

                mockMvc.perform(post("/")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(recipes.getFirst())))
                                .andExpect(status().isCreated());
        }

        @Test
        void alterRecipe_shouldReturnUpdatedRecipe() throws Exception {
                List<Recipe> recipes = sampleRecipe();
                Mockito.when(recipeService.alterRecipe(any(Recipe.class))).thenReturn(recipes.getFirst());

                mockMvc.perform(put("/")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(recipes.getFirst())))
                                .andExpect(status().isOk());
        }

        @Test
        void getRecipeById_shouldReturnRecipe() throws Exception {
                List<Recipe> recipes = sampleRecipe();
                Mockito.when(recipeService.getRecipeById(eq(recipes.getFirst().getId()), eq("user123")))
                                .thenReturn(recipes.getFirst());

                mockMvc.perform(get("/" + recipes.getFirst().getId())
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
                List<Recipe> recipes = sampleRecipe();
                Mockito.when(recipeService.getRecipesByUser("user123"))
                                .thenReturn(recipes);

                mockMvc.perform(get("/")
                                .header("X-User-Id", "user123"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].title").value("Test Recipe"));
        }

        @Test
        void deleteRecipe_shouldDeleteAndReturnNoContent() throws Exception {
                List<Recipe> recipes = sampleRecipe();
                Mockito.when(recipeService.getRecipeById(eq(recipes.getFirst().getId()), eq("user123")))
                                .thenReturn(recipes.getFirst());

                mockMvc.perform(delete("/" + recipes.getFirst().getId())
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
