package com.sadi.backend.specifications;

import com.sadi.backend.entities.Project;
import com.sadi.backend.enums.ProjectType;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;

public class ProjectSpecification {
    public static Specification<Project> withTitle(String title) {
        return (root, query, cb) -> {
            if (title != null && !title.isEmpty()) {
                return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
            }
            return null;
        };
    }

    public static Specification<Project> withDateBetween(Instant startDate, Instant endDate) {
        return (root, query, cb) -> {
            if (startDate != null && endDate != null) {
                return cb.between(root.get("createdAt"), startDate, endDate);
            }
            return null;
        };
    }


    public static Specification<Project> withAuthorId(String userId) {
        return (root, query, cb) -> {
            if (userId != null) {
                return cb.equal(root.get("user").get("id"), userId);
            }
            return null;
        };
    }

    public static Specification<Project> withProjectType(ProjectType type) {
        return (root, query, cb) -> {
            if (type != null) {
                return cb.equal(root.get("type"), type.toString());
            }
            return null;
        };
    }

    public static Specification<Project> withAuthorName(String authorName) {
        return (root, query, cb) -> {
            if (authorName != null && !authorName.isEmpty()) {
                return cb.like(cb.lower(root.get("user").get("fullName")), "%" + authorName.toLowerCase() + "%");
            }
            return null;
        };
    }

    public static Specification<Project> sortBy(Sort.Direction direction, Project.SortCategory category) {
        return (root, query, cb) -> {
            assert query != null;
            query.orderBy(direction == Sort.Direction.ASC ?
                    cb.asc(root.get(category.getValue())) :
                    cb.desc(root.get(category.getValue())));
            return null; // sorting doesn't affect the where clause
        };
    }
}
