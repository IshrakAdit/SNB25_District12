package com.sadi.backend.controllers;

import com.sadi.backend.entities.User;
import com.sadi.backend.enums.Role;
import com.sadi.backend.repositories.UserRepository;
import com.sadi.backend.services.AuthService;
import com.sadi.backend.services.UserService;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/v1/public/creator")
@Profile("!prod")
public class GarbageController {


    private final UserService userService;
    private final UserRepository userRepository;
    private final AuthService authService;

    public GarbageController(UserService userService, UserRepository userRepository, AuthService authService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<Void> garbage(
            @RequestParam String userId,
            @RequestParam Role role,
            @RequestParam String email
    ) {
        if(userService.userExists(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with id " + userId + " already exists");
        }
        User user = new User(
                userId,
                email,
                userService.extractFullName(email),
                role
        );
        userRepository.save(user);
        authService.addScope(userId, role);
        return ResponseEntity.ok().build();
    }
}
