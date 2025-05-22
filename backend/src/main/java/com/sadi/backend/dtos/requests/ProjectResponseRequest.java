package com.sadi.backend.dtos.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjectResponseRequest(
        @NotNull(message = "body can't be null")
        @Size(message = "body length must be between 1 to 65535", min = 1, max = 65535)
        String body,

        String bkashNumber
) {
}
