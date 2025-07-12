package com.devops.entities.users.dtos;

import jakarta.validation.constraints.NotNull;

public record UserId(@NotNull String userId) {
}
