package com.sadi.backend.dtos.responses;

import java.time.Instant;
import java.util.UUID;

public record ProjectResFullResponse(
        UUID id,
        String body,
        String authorId,
        String authorName,
        String authorProfilePicture,
        String bkashNumber,
        Boolean isVerified,
        Instant createdAt
) {
}
