package com.sadi.backend.repositories;

import com.sadi.backend.dtos.responses.ProjectFullResponse;
import com.sadi.backend.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID>, JpaSpecificationExecutor<Project> {
    @Query("select new com.sadi.backend.dtos.responses.ProjectFullResponse(b.id, b.title, b.body, b.user.id, b.user.fullName, b.user.profilePicture, b.createdAt, b.type, b.priority) from Project b where b.id = :id")
    Optional<ProjectFullResponse> getProjectFullResponse(UUID id);

}
