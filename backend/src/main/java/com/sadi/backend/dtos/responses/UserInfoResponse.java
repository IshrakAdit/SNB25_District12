package com.sadi.backend.dtos.responses;

import com.sadi.backend.enums.Role;

public record UserInfoResponse(
        String id,
        String fullName,
        Role role,
        String email,
        String profilePicture,
        Long credit,
        Long score,
        Long rank
) {
}
