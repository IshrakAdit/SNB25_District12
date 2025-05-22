package com.sadi.backend.repositories;

import com.sadi.backend.entities.Content;
import com.sadi.backend.entities.ContentVote;
import com.sadi.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ContentVoteRepository extends JpaRepository<ContentVote, UUID> {
    Optional<ContentVote> findByContentAndUser(Content content, User user);
}
