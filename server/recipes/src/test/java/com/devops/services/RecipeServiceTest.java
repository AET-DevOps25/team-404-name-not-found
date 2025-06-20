package com.devops.services;

import com.devops.entities.Difficulty;
import com.devops.entities.Recipe;
import com.devops.repositories.RecipeRepository;
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

class RecipeServiceTest {

    @Mock
    private RecipeRepository recipeRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private RecipeService recipeService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        recipeService = new RecipeService(recipeRepository);
        recipeService.host = "localhost:8080";
    }

    @Test
    @DisplayName("Should fallback and return dummy recipe on AI service failure")
    void generateRecipe_shouldFallbackOnError() {
        List<String> ingredients = List.of("Flour", "Eggs", "Milk");
        String userId = "user-123";

        // Force a failure in AI service call
        RecipeService spyService = spy(recipeService);
        doThrow(new RuntimeException("AI service down"))
                .when(spyService)
                .generateRecipe(eq(ingredients), eq(userId));

        Recipe fallback = recipeService.generateRecipe(ingredients, userId);

        assertEquals("Fallback Recipe", fallback.getTitle());
        assertEquals(Difficulty.EASY, fallback.getDifficulty());
        assertEquals(30, fallback.getCookingTime());
        assertEquals(userId, fallback.getUserId());
        assertEquals(ingredients, fallback.getIngredients());
    }

    @Test
    @DisplayName("Should get recipes by user")
    void getRecipesByUser_shouldReturnRecipes() {
        String userId = "user-1";
        Recipe recipe = new Recipe();
        recipe.setId("abc");
        recipe.setUserId(userId);
        when(recipeRepository.findAllByUserId(userId)).thenReturn(List.of(recipe));

        List<Recipe> result = recipeService.getRecipesByUser(userId);
        assertEquals(1, result.size());
        assertEquals(userId, result.get(0).getUserId());
    }

    @Test
    @DisplayName("Should get recipe by ID and validate owner")
    void getRecipeById_shouldCheckOwnership() {
        String recipeId = UUID.randomUUID().toString();
        String userEmail = "user@example.com";

        Recipe ownedRecipe = new Recipe();
        ownedRecipe.setId(recipeId);
        ownedRecipe.setUserId(userEmail);

        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(ownedRecipe));

        Recipe result = recipeService.getRecipeById(recipeId, userEmail);
        assertNotNull(result);
        assertEquals(recipeId, result.getId());

        Recipe otherUserRecipe = new Recipe();
        otherUserRecipe.setId(recipeId);
        otherUserRecipe.setUserId("other@example.com");
        when(recipeRepository.findById(recipeId)).thenReturn(Optional.of(otherUserRecipe));

        Recipe denied = recipeService.getRecipeById(recipeId, userEmail);
        assertNull(denied);
    }

    @Test
    @DisplayName("Should save and return recipe")
    void saveRecipe_shouldSave() {
        Recipe input = new Recipe();
        input.setTitle("Pizza");
        when(recipeRepository.save(input)).thenReturn(input);

        Recipe result = recipeService.saveRecipe(input);
        assertEquals("Pizza", result.getTitle());
    }

    @Test
    @DisplayName("Should delete recipe if owned by user")
    void deleteRecipe_shouldDeleteIfOwned() {
        String recipeId = "r1";
        String userId = "u1";

        Recipe r = new Recipe();
        r.setId(recipeId);
        r.setUserId(userId);

        when(recipeRepository.findAllByUserId(userId)).thenReturn(List.of(r));

        recipeService.deleteRecipe(recipeId, userId);

        verify(recipeRepository, times(1)).deleteById(recipeId);
    }

    @Test
    @DisplayName("Should not delete if recipe not owned by user")
    void deleteRecipe_shouldNotDeleteIfNotOwned() {
        String recipeId = "r1";
        String userId = "u1";

        Recipe r = new Recipe();
        r.setId("other-id");
        r.setUserId(userId);

        when(recipeRepository.findAllByUserId(userId)).thenReturn(List.of(r));

        recipeService.deleteRecipe(recipeId, userId);

        verify(recipeRepository, never()).deleteById(any());
    }
}
