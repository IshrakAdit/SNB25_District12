package com.sadi.backend.dtos.responses;

import java.time.Instant;
import java.util.UUID;

public record ContentFullResponse(
        UUID id,
        String topicId,
        String title,
        String body,
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
