package com.sadi.backend.dtos.responses;

public record UserInfoResponse(
        String id,
        String fullName,
        String email,
        String profilePicture
) {
}
