package com.devops.dto;

import lombok.Data;

@Data
public class Ingredient {
    private String name;
    private int amount;
    private Unit unit;
}
