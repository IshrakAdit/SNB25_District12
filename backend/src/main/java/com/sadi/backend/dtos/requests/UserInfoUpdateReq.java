package com.sadi.backend.dtos.requests;

public record UserInfoUpdateReq(
        String fullName,
        String profilePicture
) {
}
