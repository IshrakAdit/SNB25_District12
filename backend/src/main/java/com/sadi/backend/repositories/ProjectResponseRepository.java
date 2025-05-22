package com.sadi.backend.repositories;

import com.sadi.backend.dtos.responses.ProjectResFullResponse;
import com.sadi.backend.dtos.responses.ProjectResShortResponse;
import com.sadi.backend.entities.ProjectResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectResponseRepository extends JpaRepository<ProjectResponse, UUID> {

    @Query("select new com.sadi.backend.dtos.responses.ProjectResShortResponse(b.id, b.user.id, b.user.fullName, b.user.profilePicture, b.bkash, b.isVarified, b.createdAt, b.body) from ProjectResponse b where b.project.id = :projectId and (:isVerified is null or b.isVarified = :isVerified)")
    Page<ProjectResShortResponse> getProjectShortResponse(UUID projectId, Boolean isVerified, Pageable pageable);

    @Query("select new com.sadi.backend.dtos.responses.ProjectResFullResponse(b.id, b.body, b.user.id, b.user.fullName, b.user.profilePicture, b.bkash, b.isVarified, b.createdAt) from ProjectResponse b where b.id = :id")
    Optional<ProjectResFullResponse> getProjectFullResponse(UUID id);
}
