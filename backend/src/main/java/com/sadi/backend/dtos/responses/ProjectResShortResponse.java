package com.sadi.backend.dtos.responses;

import java.time.Instant;
import java.util.UUID;

public record ProjectResShortResponse(
        UUID id,
        String authorId,
        String authorName,
        String authorProfilePicture,
        String bkashNumber,
        Boolean isVerified,
        Instant createdAt,
        String body
) {
}
