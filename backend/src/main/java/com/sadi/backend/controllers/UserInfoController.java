package com.sadi.backend.controllers;

import com.sadi.backend.dtos.requests.UserInfoUpdateReq;
import com.sadi.backend.dtos.responses.UserInfoResponse;
import com.sadi.backend.entities.User;
import com.sadi.backend.services.UserService;
import com.sadi.backend.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/v1/users")
public class UserInfoController {

    private final UserService userService;

    public UserInfoController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping
    public ResponseEntity<Void> updateUserInfo(@RequestBody UserInfoUpdateReq req) {
        userService.updateUserInfo(req);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<UserInfoResponse> getUserInfo(
            @RequestParam(required = false) String userId
    ) {
        if (Objects.isNull(userId)) {
            userId = SecurityUtils.getName();
        }

        User user = userService.getUser(userId);
        return ResponseEntity.ok(new UserInfoResponse(user.getId(),
                user.getFullName(), user.getEmail(), user.getProfilePicture()));
    }
}
