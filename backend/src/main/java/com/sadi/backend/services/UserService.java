package com.sadi.backend.services;

import com.sadi.backend.dtos.requests.UserInfoUpdateReq;
import com.sadi.backend.dtos.responses.LeaderboardEntry;
import com.sadi.backend.dtos.responses.UserLeaderboardDto;
import com.sadi.backend.entities.User;
import com.sadi.backend.enums.Role;
import com.sadi.backend.repositories.UserRepository;
import com.sadi.backend.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean userExists(String uuid) {
        return this.userRepository.existsById(uuid);
    }

    public User getUser(String id) {
        return userRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
        );
    }

    public void saveUser(Role role) {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = new User(
                jwt.getSubject(),
                jwt.getClaimAsString("email"),
                extractFullName(jwt.getClaimAsString("email")),
                role
        );
        userRepository.save(user);
    }

    public void updateUserInfo(UserInfoUpdateReq req) {
        String userId = SecurityUtils.getName();
        User user = getUser(userId);

        if(!Objects.isNull(req.fullName()) && !req.fullName().isEmpty())
            user.setFullName(req.fullName());
        if(!Objects.isNull(req.profilePicture()) && !req.profilePicture().isEmpty())
            user.setProfilePicture(req.profilePicture());
        userRepository.save(user);
    }

    public String extractFullName(String email) {
        if (email == null || !email.contains("@")) {
            return null; // or throw an IllegalArgumentException
        }

        return email.substring(0, email.indexOf('@'));
    }

    public Long getRank(String userId, Long score) {
        return userRepository.getUserRank(score);
    }

    public Page<UserLeaderboardDto> getLeaderboard(Pageable pageable) {
        return userRepository.findUsersLeaderboard(pageable);
    }
}
