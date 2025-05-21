package com.sadi.backend.dtos.requests;

import com.sadi.backend.enums.Role;
import jakarta.validation.constraints.NotNull;

public record RegistrationRequest(
        @NotNull Role role
) {
}
