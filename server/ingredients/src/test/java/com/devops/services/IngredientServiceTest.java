package com.devops.services;

import com.devops.entities.Ingredient;
import com.devops.repositories.IngredientRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class IngredientServiceTest {

    @Mock
    private IngredientRepository ingredientRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private IngredientService ingredientService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ingredientService = new IngredientService(ingredientRepository);
    }

    @Test
    @DisplayName("Should get ingredients by user")
    void getIngredientsByUser_shouldReturnIngredients() {
        String userId = "user-1";
        Ingredient ingredient = new Ingredient();
        ingredient.setId("abc");
        ingredient.setUserId(userId);
        when(ingredientRepository.findAllByUserId(userId)).thenReturn(List.of(ingredient));

        List<Ingredient> result = ingredientService.getIngredientsByUser(userId);
        assertEquals(1, result.size());
        assertEquals(userId, result.get(0).getUserId());
    }

    @Test
    @DisplayName("Should get ingredient by ID and validate owner")
    void getIngredientById_shouldCheckOwnership() {
        String ingredientId = UUID.randomUUID().toString();
        String userEmail = "user@example.com";

        Ingredient ownedIngredient = new Ingredient();
        ownedIngredient.setId(ingredientId);
        ownedIngredient.setUserId(userEmail);

        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(ownedIngredient));

        Ingredient result = ingredientService.getIngredientById(ingredientId, userEmail);
        assertNotNull(result);
        assertEquals(ingredientId, result.getId());

        Ingredient otherUserIngredient = new Ingredient();
        otherUserIngredient.setId(ingredientId);
        otherUserIngredient.setUserId("other@example.com");
        when(ingredientRepository.findById(ingredientId)).thenReturn(Optional.of(otherUserIngredient));

        Ingredient denied = ingredientService.getIngredientById(ingredientId, userEmail);
        assertNull(denied);
    }

    @Test
    @DisplayName("Should save and return ingredient")
    void saveIngredient_shouldSave() {
        Ingredient input = new Ingredient();
        input.setName("Potato");
        List<Ingredient> inputs = List.of(input);
        when(ingredientRepository.saveAll(inputs)).thenReturn(inputs);

        List<Ingredient> result = ingredientService.saveIngredients(inputs);
        assertEquals("Potato", result.getFirst().getName());
    }

    @Test
    @DisplayName("Should delete ingredient if owned by user")
    void deleteIngredient_shouldDeleteIfOwned() {
        String ingredientId = "r1";
        String userId = "u1";

        Ingredient r = new Ingredient();
        r.setId(ingredientId);
        r.setUserId(userId);

        when(ingredientRepository.findAllByUserId(userId)).thenReturn(List.of(r));

        ingredientService.deleteIngredient(ingredientId, userId);

        verify(ingredientRepository, times(1)).deleteById(ingredientId);
    }

    @Test
    @DisplayName("Should not delete if ingredient not owned by user")
    void deleteIngredient_shouldNotDeleteIfNotOwned() {
        String ingredientId = "r1";
        String userId = "u1";

        Ingredient r = new Ingredient();
        r.setId("other-id");
        r.setUserId(userId);

        when(ingredientRepository.findAllByUserId(userId)).thenReturn(List.of(r));

        ingredientService.deleteIngredient(ingredientId, userId);

        verify(ingredientRepository, never()).deleteById(any());
    }
}
