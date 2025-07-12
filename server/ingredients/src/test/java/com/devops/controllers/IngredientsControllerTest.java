package com.devops.controllers;

import com.devops.entities.Ingredient;
import com.devops.entities.Unit;
import com.devops.services.IngredientService;
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

@WebMvcTest(IngredientsController.class)
class IngredientControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IngredientService ingredientService;

    @Autowired
    private ObjectMapper objectMapper;

    private List<Ingredient> sampleIngredient() {
        return List.of(new Ingredient(
            UUID.randomUUID().toString(),
            "Test Ingredient",
            30,
            Unit.G,
            "user123"));
    }

    @Test
    void saveIngredient_shouldReturnCreatedIngredient() throws Exception {
        List<Ingredient> ingredients = sampleIngredient();
        Mockito.when(ingredientService.saveIngredients(anyList()))
            .thenReturn(ingredients);

        mockMvc.perform(post("/")
                .header("X-User-Id", "user123")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(ingredients)))
            .andExpect(status().isCreated());
    }

    @Test
    void noUserIdSetInHeader_saveIngredient_shouldReturnInternalServerError() throws Exception {
        mockMvc.perform(post("/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleIngredient())))
            .andExpect(status().isInternalServerError());
    }

    @Test
    void alterIngredient_shouldReturnUpdatedIngredient() throws Exception {
        List<Ingredient> ingredients = sampleIngredient();
        Mockito.when(ingredientService.alterIngredient(any(Ingredient.class)))
            .thenReturn(ingredients.getFirst());

        mockMvc.perform(put("/")
                .contentType(MediaType.APPLICATION_JSON)
                .header("X-User-Id", "user123")
                .content(objectMapper.writeValueAsString(ingredients.getFirst())))
            .andExpect(status().isOk());
    }

    @Test
    void noUserIdSetInHeader_alterIngredient_shouldReturnInternalServerError() throws Exception {
        mockMvc.perform(put("/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleIngredient().getFirst())))
            .andExpect(status().isInternalServerError());
    }

    @Test
    void getIngredientById_shouldReturnIngredient() throws Exception {
        List<Ingredient> ingredients = sampleIngredient();
        Mockito.when(ingredientService.getIngredientById(eq(ingredients.getFirst().getId()), eq("user123")))
            .thenReturn(ingredients.getFirst());

        mockMvc.perform(get("/" + ingredients.getFirst().getId())
                .header("X-User-Id", "user123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.name").value("Test Ingredient"));
    }

    @Test
    void getIngredientById_shouldReturn404IfNotFound() throws Exception {
        Mockito.when(ingredientService.getIngredientById(anyString(), anyString()))
            .thenReturn(null);

        mockMvc.perform(get("/some-id")
                .header("X-User-Id", "user123"))
            .andExpect(status().isNotFound());
    }

    @Test
    void noUserIdSetInHeader_getIngredientById_shouldReturnInternalServerError() throws Exception {
        mockMvc.perform(get("/" + "some-id"))
            .andExpect(status().isInternalServerError());
    }

    @Test
    void getAllIngredientsForUser_shouldReturnList() throws Exception {
        List<Ingredient> ingredients = sampleIngredient();
        Mockito.when(ingredientService.getIngredientsByUser("user123"))
            .thenReturn(ingredients);

        mockMvc.perform(get("/")
                .header("X-User-Id", "user123"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].name").value("Test Ingredient"));
    }

    @Test
    void noUserIdSetInHeader_getAllIngredientsForUser_shouldReturnInternalServerError() throws Exception {
        mockMvc.perform(get("/"))
            .andExpect(status().isInternalServerError());
    }

    @Test
    void deleteIngredient_shouldDeleteAndReturnNoContent() throws Exception {
        List<Ingredient> ingredients = sampleIngredient();
        Mockito.when(ingredientService.getIngredientById(eq(ingredients.getFirst().getId()), eq("user123")))
            .thenReturn(ingredients.getFirst());

        mockMvc.perform(delete("/" + ingredients.getFirst().getId())
                .header("X-User-Id", "user123"))
            .andExpect(status().isNoContent());
    }

    @Test
    void deleteIngredient_shouldReturn404IfIngredientNotFound() throws Exception {
        Mockito.when(ingredientService.getIngredientById(anyString(), anyString()))
            .thenReturn(null);

        mockMvc.perform(delete("/nonexistent")
                .header("X-User-Id", "user123"))
            .andExpect(status().isNotFound());
    }

    @Test
    void noUserIdSet_deleteIngredient_shouldReturnInternalServerError() throws Exception {
        mockMvc.perform(delete("/" + "some-id"))
            .andExpect(status().isInternalServerError());
    }
}
