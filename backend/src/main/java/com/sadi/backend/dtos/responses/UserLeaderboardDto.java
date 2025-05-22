package com.sadi.backend.dtos.responses;

public record UserLeaderboardDto(
        String id,
        String fullName,
        String profilePicture,
        Long score,
        Long rank
) {
}
