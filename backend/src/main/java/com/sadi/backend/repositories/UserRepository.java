package com.sadi.backend.repositories;

import com.sadi.backend.dtos.responses.LeaderboardEntry;
import com.sadi.backend.dtos.responses.UserLeaderboardDto;
import com.sadi.backend.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);

    @Query("select count(distinct u.score) from User u where u.score < :score")
    Long getUserRank(Long score);

    @Query(value = """
        SELECT new com.sadi.backend.dtos.responses.UserLeaderboardDto(
            u.id, 
            u.fullName, 
            u.profilePicture, 
            u.score,
            DENSE_RANK() OVER (ORDER BY u.score DESC)
        )
        FROM User u
        ORDER BY u.score DESC, u.id ASC
        """)
    Page<UserLeaderboardDto> findUsersLeaderboard(Pageable pageable);
}
