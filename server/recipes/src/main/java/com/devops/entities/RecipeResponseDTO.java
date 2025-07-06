package com.devops.entities;

import lombok.Data;

import java.util.List;

@Data
public class RecipeResponseDTO {
    private List<AiRecipeDTO> recipes;
}
