package com.sadi.backend.specifications;

import com.sadi.backend.entities.Content;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.time.Instant;
import java.time.LocalDateTime;

public class ContentSpecification {
    public static Specification<Content> withTitle(String title) {
        return (root, query, cb) -> {
            if (title != null && !title.isEmpty()) {
                return cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%");
            }
            return null;
        };
    }

    public static Specification<Content> withDateBetween(Instant startDate, Instant endDate) {
        return (root, query, cb) -> {
            if (startDate != null && endDate != null) {
                return cb.between(root.get("createdAt"), startDate, endDate);
            }
            return null;
        };
    }

    public static Specification<Content> withAuthorId(String userId) {
        return (root, query, cb) -> {
            if (userId != null) {
                return cb.equal(root.get("user").get("id"), userId);
            }
            return null;
        };
    }

    public static Specification<Content> withTopicId(String topicId) {
        return (root, query, cb) -> {
            if (topicId != null) {
                return cb.equal(root.get("topic").get("id"), topicId);
            }
            return null;
        };
    }

    public static Specification<Content> withAuthorName(String authorName) {
        return (root, query, cb) -> {
            if (authorName != null && !authorName.isEmpty()) {
                return cb.like(cb.lower(root.get("user").get("fullName")), "%" + authorName.toLowerCase() + "%");
            }
            return null;
        };
    }

    public static Specification<Content> sortByTimestamp(Sort.Direction direction) {
        return (root, query, cb) -> {
            assert query != null;
            query.orderBy(direction == Sort.Direction.ASC ?
                    cb.asc(root.get("createdAt")) :
                    cb.desc(root.get("createdAt")));
            return null; // sorting doesn't affect the where clause
        };
    }

    public static Specification<Content> sortByVote(Sort.Direction direction) {
        return (root, query, cb) -> {
            assert query != null;
            query.orderBy(direction == Sort.Direction.ASC ?
                    cb.asc(root.get("upvoteCount")) :
                    cb.desc(root.get("upvoteCount")));
            return null; // sorting doesn't affect the where clause
        };
    }
}
