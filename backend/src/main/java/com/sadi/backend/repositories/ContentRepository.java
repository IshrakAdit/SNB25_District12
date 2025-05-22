package com.sadi.backend.repositories;

import com.sadi.backend.dtos.responses.ContentFullResponse;
import com.sadi.backend.entities.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ContentRepository extends JpaRepository<Content, UUID>, JpaSpecificationExecutor<Content> {
    @Query("select new com.sadi.backend.dtos.responses.ContentFullResponse(b.id, b.topic.id, b.title, b.body, (select bv.id from ContentVote bv where bv.content.id = :id and bv.user.id = :userId), b.user.id, b.user.fullName, b.user.profilePicture, b.coverPhoto, b.summary, b.upvoteCount, b.createdAt) from Content b where b.id = :id")
    Optional<ContentFullResponse> getFullBlogInfo(UUID id, String userId);
}
