package com.sadi.backend.dtos.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ContentTopicCreateRequest(
        @NotNull(message = "Must provide an unique id") String id,
        @NotNull(message = "Must provide an description")
        @Size(min = 1, max = 255, message = "Description must be between 1 and 255 characters long")
        String description
) {
}
