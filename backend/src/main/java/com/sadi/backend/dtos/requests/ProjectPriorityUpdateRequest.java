package com.sadi.backend.dtos.requests;

import jakarta.validation.constraints.NotNull;

public record ProjectPriorityUpdateRequest(
        @NotNull(message = "priority field can't be null") Integer priority
) {
}
