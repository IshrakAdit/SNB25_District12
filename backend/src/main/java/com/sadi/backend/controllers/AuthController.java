package com.sadi.backend.controllers;

import com.sadi.backend.dtos.requests.RegistrationRequest;
import com.sadi.backend.dtos.responses.StatusResponse;
import com.sadi.backend.exceptions.UserAlreadyExistsException;
import com.sadi.backend.services.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/v1/auth")
@Slf4j
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<StatusResponse> addUser(@Valid @RequestBody RegistrationRequest req){
        log.debug("Received request to register a new user: {}", req.role());
        try{
            authService.registerUser(req.role());
            return ResponseEntity.ok(new StatusResponse("created"));
        }
        catch(UserAlreadyExistsException e){
            return ResponseEntity.ok(new StatusResponse("exists"));
        }
    }
}
