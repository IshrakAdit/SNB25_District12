package com.sadi.backend.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.sadi.backend.entities.User;
import com.sadi.backend.enums.Role;
import com.sadi.backend.exceptions.UserAlreadyExistsException;
import com.sadi.backend.repositories.UserRepository;
import com.sadi.backend.utils.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Slf4j
@Service
public class AuthService {
    private final UserService userService;
    private final UserRepository userRepository;

    public AuthService(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    public void registerUser(Role role){
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = jwt.getClaim("email");
        Optional<User> user = userRepository.findByEmail(email);
        if(user.isPresent()) throw new UserAlreadyExistsException("User with email " + email + " already exists");

        addScope(SecurityUtils.getName(), role);
        userService.saveUser(role);
    }

    public void addScope(String uuid, Role role){
        FirebaseAuth firebaseAuth = FirebaseAuth.getInstance();
        try {
            firebaseAuth.setCustomUserClaims(uuid, Collections.singletonMap("scp", role.toString()));
        } catch (FirebaseAuthException e) {
            log.error("Error adding scope to user in firebase: {}", e.getMessage());
            throw new InternalError("Error adding scope to user in firebase");
        }
    }
}
