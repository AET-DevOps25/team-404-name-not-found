package com.devops.entities.users.dtos;

import com.devops.entities.users.UserRole;

public record RegisterDTO(String name, String email, String password, UserRole role) {
}
