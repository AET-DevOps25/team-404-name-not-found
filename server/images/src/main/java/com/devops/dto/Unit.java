package com.devops.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Unit {
    PCS("pcs"), ML("ml"), G("g");

    private final String unit;

    @JsonValue
    public String getUnit() {
        return unit;
    }

    @JsonCreator
    public static Unit fromValue(String value) {
        for (Unit unit : Unit.values()) {
            if (unit.unit.equalsIgnoreCase(value)) {
                return unit;
            }
        }
        throw new IllegalArgumentException("Unknown unit: " + value);
    }
}
