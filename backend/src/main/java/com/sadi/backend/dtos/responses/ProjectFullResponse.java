package com.sadi.backend.dtos.responses;

import com.sadi.backend.enums.ProjectType;

import java.time.Instant;
import java.util.UUID;

public record ProjectFullResponse(
        UUID id,
        String title,
        String body,
        String authorId,
        String authorName,
        String authorProfilePicture,
        Instant createdAt,
        ProjectType type,
        Integer priority
) {
}
