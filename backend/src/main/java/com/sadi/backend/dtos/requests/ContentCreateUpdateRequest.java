package com.sadi.backend.dtos.requests;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.aspectj.weaver.ast.Not;

public record ContentCreateUpdateRequest(
        @NotNull(message = "body field can't be null")
        @Size(min = 1, max = 65535, message = "body size must be between 1 and 65535")
        String body,

        @NotNull(message = "title field can't be null")
        @Size(min = 1, max = 255, message = "title size must be between 1 and 255")
        String title,

        @NotNull(message = "Must provide a topic ID")
        String topicId,

        @NotNull(message = "Must provide a cover photo")
        @Size(min = 1, max = 1000, message = "Cover Photo URL must be between 1 and 1000")
        String coverPhoto,

        @NotNull(message = "Must provide a short summary")
        @Size(min = 1, max = 1000, message = "Summary must be between 1 and 1000")
        String summary
) {
}
