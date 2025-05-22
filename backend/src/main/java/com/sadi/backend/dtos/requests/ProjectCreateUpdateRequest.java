package com.sadi.backend.dtos.requests;

import com.sadi.backend.enums.ProjectType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ProjectCreateUpdateRequest(
        @NotNull(message = "Title can't be null")
        @Size(min = 1, max = 255, message = "Title must be between 1 to 255 characters long")
        String title,

        @NotNull(message = "Body can't be null")
        @Size(min = 1, max = 255, message = "Body must be between 1 to 65535 characters long")
        String body,

        @NotNull(message = "Type can't be null")
        ProjectType type
        )
{}
