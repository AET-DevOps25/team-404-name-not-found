package com.devops.entities;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AiRecipeRequest {
    private List<Ingredient> ingredients;
}
