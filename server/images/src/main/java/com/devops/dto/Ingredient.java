package com.devops.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Ingredient {
    @NotNull
    private String name;
    @NotNull
    private int amount;
    @NotNull
    private Unit unit;
}
