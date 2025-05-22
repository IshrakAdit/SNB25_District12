package com.sadi.backend.services;

import com.sadi.backend.dtos.requests.ProjectResponseRequest;
import com.sadi.backend.dtos.responses.ProjectResFullResponse;
import com.sadi.backend.dtos.responses.ProjectResShortResponse;
import com.sadi.backend.entities.Project;
import com.sadi.backend.entities.ProjectResponse;
import com.sadi.backend.entities.User;
import com.sadi.backend.repositories.ProjectResponseRepository;
import com.sadi.backend.utils.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class ProjectResponseService {
    private final ProjectResponseRepository projectResponseRepository;
    private final UserService userService;
    private final ProjectService projectService;

    public ProjectResponseService(ProjectResponseRepository projectResponseRepository, UserService userService, ProjectService projectService) {
        this.projectResponseRepository = projectResponseRepository;
        this.userService = userService;
        this.projectService = projectService;
    }

    public ProjectResponse getProjectResponse(UUID id) {
        return projectResponseRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project response not found")
        );

    }

    public UUID createProjectResponse(@Valid ProjectResponseRequest req, UUID projectId) {
        String userId = SecurityUtils.getName();
        User user = userService.getUser(userId);
        Project project = projectService.getProject(projectId);

        ProjectResponse projectResponse = new ProjectResponse(
                user, project, req.body(), req.bkashNumber()
        );

        return projectResponseRepository.save(projectResponse).getId();
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void verifyProjectResponse(UUID responseId, Boolean verify) {
        String userId = SecurityUtils.getName();
        ProjectResponse response = getProjectResponse(responseId);
        Project project = response.getProject();

        if(response.getIsVarified() == verify) return;
        if(!project.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have permission to access this project");
        }
        response.setIsVarified(verify);
        projectResponseRepository.save(response);
    }

    public Page<ProjectResShortResponse> getResponses(UUID projectId, Boolean isVerified, Pageable pageable){
        return projectResponseRepository.getProjectShortResponse(projectId, isVerified, pageable);
    }

    public ProjectResFullResponse getResponse(UUID responseId) {
        return projectResponseRepository.getProjectFullResponse(responseId).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found")
        );
    }
}
