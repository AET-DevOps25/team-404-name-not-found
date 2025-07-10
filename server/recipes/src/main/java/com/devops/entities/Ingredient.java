package com.devops.entities;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ingredient {
    @NotNull
    private String name;
    @NotNull
    private int amount;
    @NotNull
    private Unit unit;
}
