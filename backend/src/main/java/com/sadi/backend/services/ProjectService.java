package com.sadi.backend.services;

import com.sadi.backend.dtos.requests.ProjectCreateUpdateRequest;
import com.sadi.backend.dtos.requests.ProjectPriorityUpdateRequest;
import com.sadi.backend.dtos.responses.ProjectFullResponse;
import com.sadi.backend.dtos.responses.ProjectShortResponse;
import com.sadi.backend.entities.Project;
import com.sadi.backend.entities.User;
import com.sadi.backend.enums.ProjectType;
import com.sadi.backend.repositories.ProjectRepository;
import com.sadi.backend.specifications.ProjectSpecification;
import com.sadi.backend.utils.SecurityUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserService userService;

    @PersistenceContext
    private EntityManager entityManager;

    public ProjectService(ProjectRepository projectRepository, UserService userService) {
        this.projectRepository = projectRepository;
        this.userService = userService;
    }

    public Project getProject(UUID id){
        return projectRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found")
        );
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public UUID createProject(@Valid ProjectCreateUpdateRequest req) {
        String userId = SecurityUtils.getName();
        User user = userService.getUser(userId);
        Project project = new Project(
                user,
                req.title(),
                req.body(),
                req.type()
        );
        return projectRepository.save(project).getId();
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void updateProject(@Valid ProjectCreateUpdateRequest req, UUID id) {
        String userId = SecurityUtils.getName();
        Project project = getProject(id);
        verifyOwner(project, userId);

        project.setTitle(req.title());
        project.setBody(req.body());
        project.setType(req.type());
        projectRepository.save(project);
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteProject(UUID id) {
        String userId = SecurityUtils.getName();
        Project project = getProject(id);
        verifyOwner(project, userId);

        projectRepository.delete(project);
    }

    public void verifyOwner(Project project, String userId) {
        if (!Objects.equals(project.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have write permission of this project");
        }
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void updatePriority(UUID id, @Valid ProjectPriorityUpdateRequest req) {
        Project project = getProject(id);
        project.setPriority(req.priority());

        projectRepository.save(project);
    }

    public Page<ProjectShortResponse> filterProjects(Specification<Project> spec, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ProjectShortResponse> cq = cb.createQuery(ProjectShortResponse.class);

        Root<Project> root = cq.from(Project.class);


        List<Predicate> predicates = new ArrayList<>();
        if (spec != null) {
            Predicate specPredicate = spec.toPredicate(root, cq, cb);
            if (specPredicate != null) {
                predicates.add(specPredicate);
            }
        }
        cq.where(predicates.toArray(new Predicate[0]));

        querySelectForRegisteredUser(cq, cb, root);

        TypedQuery<ProjectShortResponse> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<ProjectShortResponse> result =  query.getResultList();
        assert spec != null;
        long total = projectRepository.count(spec);
        return new PageImpl<>(result, pageable, total);
    }

    private void querySelectForRegisteredUser(CriteriaQuery<ProjectShortResponse> cq,
                                              CriteriaBuilder cb,
                                              Root<Project> root) {
        cq.select(cb.construct(ProjectShortResponse.class,
                root.get("id"),
                root.get("title"),
                root.get("user").get("id"),
                root.get("user").get("fullName"),
                root.get("user").get("profilePicture"),
                root.get("createdAt"),
                root.get("type")
        ));
    }

    public Specification<Project> getSpecification(Instant startTime, Instant endTime, String authorId, ProjectType type,
                                                   String title,
                                                   String authorName, Project.SortCategory sortType,
                                                   Sort.Direction sortDirection){
        Specification<Project> spec = Specification.where(null);
        return spec.and(ProjectSpecification.withDateBetween(startTime, endTime))
                .and(ProjectSpecification.withTitle(title))
                .and(ProjectSpecification.withAuthorId(authorId))
                .and(ProjectSpecification.withProjectType(type))
                .and(ProjectSpecification.withAuthorName(authorName))
                .and(ProjectSpecification.sortBy(sortDirection, sortType));

    }

    public ProjectFullResponse getProjectFullRes(UUID id) {
        return projectRepository.getProjectFullResponse(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "project not found")
        );
    }
}
