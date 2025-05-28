package com.devops.entities.users.dtos;

import java.util.List;

public record RecipeDto(
                String name,
                List<String> ingredients) {
}