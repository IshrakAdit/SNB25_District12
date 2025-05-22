package com.sadi.backend.dtos.responses;

import com.sadi.backend.enums.ProjectType;

import java.time.Instant;
import java.util.UUID;

public record ProjectShortResponse(
        UUID id,
        String title,
        String authorId,
        String authorName,
        String authorProfilePicture,
        Instant createdAt,
        ProjectType type
) {
}
