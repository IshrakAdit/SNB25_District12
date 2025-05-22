package com.sadi.backend.controllers;

import com.sadi.backend.dtos.requests.ProjectCreateUpdateRequest;
import com.sadi.backend.dtos.requests.ProjectPriorityUpdateRequest;
import com.sadi.backend.dtos.requests.ProjectResponseRequest;
import com.sadi.backend.dtos.responses.ProjectFullResponse;
import com.sadi.backend.dtos.responses.ProjectResFullResponse;
import com.sadi.backend.dtos.responses.ProjectResShortResponse;
import com.sadi.backend.dtos.responses.ProjectShortResponse;
import com.sadi.backend.entities.Project;
import com.sadi.backend.entities.ProjectResponse;
import com.sadi.backend.enums.ProjectType;
import com.sadi.backend.services.ProjectResponseService;
import com.sadi.backend.services.ProjectService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PagedModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;

@RestController
@RequestMapping("/v1/projects")
@Slf4j
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectResponseService projectResponseService;

    public ProjectController(ProjectService projectService, ProjectResponseService projectResponseService) {
        this.projectService = projectService;
        this.projectResponseService = projectResponseService;
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@Valid @RequestBody ProjectCreateUpdateRequest req) {
        log.debug("Request to create a project req {}", req);
        UUID id = projectService.createProject(req);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri()
                .path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateProject(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectCreateUpdateRequest req) {
        log.debug("Request to update a project with id {} req {}", id, req);
        projectService.updateProject(req, id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable UUID id) {
        log.debug("Request to delete a project, id: {}", id);
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("{id}/priority")
    public ResponseEntity<Void> updateProjectPriority(
            @PathVariable UUID id,
            @Valid @RequestBody ProjectPriorityUpdateRequest req
    ){
        log.debug("Request to update a project priority with id {} req {}", id, req);
        projectService.updatePriority(id, req);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<PagedModel<ProjectShortResponse>> getAll (
            @RequestParam(required = false, defaultValue = "1000-01-01") LocalDate startDate,
            @RequestParam(required = false, defaultValue = "9999-12-31") LocalDate endDate,
            @RequestParam(required = false) String authorId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String authorName,
            @RequestParam(required = false) ProjectType type,
            @RequestParam(required = false, defaultValue = "PRIORITY") Project.SortCategory sortType,
            @RequestParam(required = false, defaultValue = "DESC") Sort.Direction sortDirection,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false, defaultValue = "Asia/Dhaka") String zoneId
    ) {
        log.debug("Request to get all projects");
        Pageable pageable = PageRequest.of(page, size);
        Instant startTime = startDate.atStartOfDay().atZone(ZoneId.of(zoneId)).toInstant();
        Instant endTime = endDate.atTime(23, 58).atZone(ZoneId.of(zoneId)).toInstant();

        Specification<Project> spec = projectService.getSpecification(
                startTime,endTime,authorId,type, title, authorName, sortType, sortDirection
        );
        Page<ProjectShortResponse> res = projectService.filterProjects(spec, pageable);
        return ResponseEntity.ok(new PagedModel<>(res));

    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectFullResponse> getProject(
            @PathVariable UUID id
    ) {
        log.debug("Request to get project with id {}", id);
        ProjectFullResponse res = projectService.getProjectFullRes(id);
        return ResponseEntity.ok(res);
    }

    @PostMapping("/{projectId}/responses")
    public ResponseEntity<Void> addResponses(
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectResponseRequest req
    )
    {
        log.debug("Request to add responses with id {}", projectId);
        UUID id = projectResponseService.createProjectResponse(req, projectId);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri()
                .path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping("/{projectId}/responses")
    public ResponseEntity<PagedModel<ProjectResShortResponse>> getResponses(
            @PathVariable UUID projectId,
            @RequestParam(required = false) Boolean isVerified,
            @RequestParam(required = false, defaultValue = "CREATED_AT")ProjectResponse.SortCategory sortType,
            @RequestParam(required = false, defaultValue = "ASC") Sort.Direction sortDirection
            )
    {
        log.debug("Request to get responses with id {}", projectId);
        Pageable pageable = PageRequest.of(0, 10, Sort.by(sortDirection, sortType.getValue()));
        Page<ProjectResShortResponse> res = projectResponseService.getResponses(projectId, isVerified, pageable);
        return ResponseEntity.ok(new PagedModel<>(res));
    }

    @GetMapping("/responses/{id}")
    public ResponseEntity<ProjectResFullResponse> getProjectResponse(
            @PathVariable UUID id
    ){
        log.debug("Request to get project response with id {}", id);
        return ResponseEntity.ok(projectResponseService.getResponse(id));
    }

    @PutMapping("/responses/{id}")
    public ResponseEntity<Void> verifyProjectResponse(
            @PathVariable UUID id,
            @RequestParam Boolean verify
    ) {
        log.debug("Request to verify project response with id {}", verify);
        projectResponseService.verifyProjectResponse(id, verify);
        return ResponseEntity.noContent().build();
    }
}

