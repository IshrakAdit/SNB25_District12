package com.sadi.backend.dtos.responses;

import java.time.Instant;
import java.util.UUID;

public record ContentShortResponse(
        UUID id,
        String topicId,
        String title,
        UUID voteByUser,
        String authorId,
        String authorName,
        String authorProfilePicture,
        String coverPhoto,
        String summary,
        Integer upvoteCount,
        Instant createdAt

) {
}
