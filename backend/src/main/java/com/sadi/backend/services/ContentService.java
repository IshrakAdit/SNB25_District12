package com.sadi.backend.services;

import com.sadi.backend.dtos.requests.ContentCreateUpdateRequest;
import com.sadi.backend.dtos.responses.ContentFullResponse;
import com.sadi.backend.dtos.responses.ContentShortResponse;
import com.sadi.backend.entities.Content;
import com.sadi.backend.entities.ContentTopic;
import com.sadi.backend.entities.ContentVote;
import com.sadi.backend.entities.User;
import com.sadi.backend.repositories.ContentRepository;
import com.sadi.backend.repositories.ContentVoteRepository;
import com.sadi.backend.specifications.ContentSpecification;
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
import java.util.*;

@Service
public class ContentService {
    private final ContentRepository contentRepository;
    private final UserService userService;
    private final ContentVoteRepository contentVoteRepository;
    private final ContentTopicService contentTopicService;

    @PersistenceContext
    private EntityManager entityManager;

    public ContentService(ContentRepository contentRepository, UserService userService, ContentVoteRepository contentVoteRepository, ContentTopicService contentTopicService) {
        this.contentRepository = contentRepository;
        this.userService = userService;
        this.contentVoteRepository = contentVoteRepository;
        this.contentTopicService = contentTopicService;
    }

    public Content getContent(UUID id) {
        return contentRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Content not found")
        );
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public UUID addContent(ContentCreateUpdateRequest req) {
        String userId = SecurityUtils.getName();
        User user = userService.getUser(userId);
        ContentTopic topic = contentTopicService.getContentTopic(req.topicId());
        Content content = new Content(
                user,
                req.title(),
                topic,
                req.coverPhoto(),
                req.summary(),
                req.body()
        );

        return contentRepository.save(content).getId();
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void updateContent(UUID id, @Valid ContentCreateUpdateRequest req) {
        String userId = SecurityUtils.getName();
        Content content = getContent(id);
        ContentTopic topic = contentTopicService.getContentTopic(req.topicId());
        verifyContentOwner(content, userId);

        content.setTitle(req.title());
        content.setBody(req.body());
        content.setCoverPhoto(req.coverPhoto());
        content.setSummary(req.summary());
        content.setTopic(topic);
        contentRepository.save(content);
    }

    public void verifyContentOwner(Content content, String userId) {
        if (!Objects.equals(content.getUser().getId(), userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You don't have write permission of this content");
        }
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteContent(UUID id) {
        String userId = SecurityUtils.getName();
        Content content = getContent(id);
        verifyContentOwner(content, userId);

        contentRepository.delete(content);
    }

    public int voteContent(UUID id) {
        String voterId = SecurityUtils.getName();
        Content content = getContent(id);
        User voter = new User(voterId);
        Optional<ContentVote> vote = contentVoteRepository.findByContentAndUser(content, voter);
        int returnVal;
        if (vote.isPresent()) {
            contentVoteRepository.delete(vote.get());
            returnVal = -1;
        }
        else{
            ContentVote contentVote = new ContentVote(voter, content);
            contentVoteRepository.save(contentVote);
            returnVal = 1;
        }
        content.setUpvoteCount(content.getUpvoteCount() + returnVal);
        contentRepository.save(content);
        return returnVal;
    }

    public Page<ContentShortResponse> filterContents(Specification<Content> spec, Pageable pageable){
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ContentShortResponse> cq = cb.createQuery(ContentShortResponse.class);

        Root<Content> root = cq.from(Content.class);


        List<Predicate> predicates = new ArrayList<>();
        if (spec != null) {
            Predicate specPredicate = spec.toPredicate(root, cq, cb);
            if (specPredicate != null) {
                predicates.add(specPredicate);
            }
        }
        cq.where(predicates.toArray(new Predicate[0]));

        querySelectForRegisteredUser(cq, cb, root, SecurityUtils.getName());

        TypedQuery<ContentShortResponse> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<ContentShortResponse> result =  query.getResultList();
        assert spec != null;
        long total = contentRepository.count(spec);
        return new PageImpl<>(result, pageable, total);
    }

    private void querySelectForRegisteredUser(CriteriaQuery<ContentShortResponse> cq, CriteriaBuilder cb, Root<Content> root, String userId) {
        Subquery<UUID> voteIdSubQuery = cq.subquery(UUID.class);
        Root<ContentVote> contentVoteRoot = voteIdSubQuery.from(ContentVote.class);
        voteIdSubQuery.select(contentVoteRoot.get("id"));
        voteIdSubQuery.where(
                cb.equal(contentVoteRoot.get("content").get("id"), root.get("id")),
                cb.equal(contentVoteRoot.get("user").get("id"), userId)
        );

        cq.select(cb.construct(ContentShortResponse.class,
                root.get("id"),
                root.get("topic").get("id"),
                root.get("title"),
                voteIdSubQuery.alias("voteByUser"),
                root.get("user").get("id"),
                root.get("user").get("fullName"),
                root.get("user").get("profilePicture"),
                root.get("coverPhoto"),
                root.get("summary"),
                root.get("upvoteCount"),
                root.get("createdAt")
        ));
    }

    public Specification<Content> getSpecification(Instant startTime, Instant endTime, String authorId, String title,
                                                   String authorName, String topicId, Content.SortCategory sortType,
                                                   Sort.Direction sortDirection) {
        Specification<Content> spec = Specification.where(null);
        if (startTime != null && endTime != null) {
            spec = spec.and(ContentSpecification.withDateBetween(startTime, endTime));
        }
        if(title != null && !title.isEmpty()) {
            spec = spec.and(ContentSpecification.withTitle(title));
        }
        if(authorId != null){
            spec = spec.and(ContentSpecification.withAuthorId(authorId));
        }
        if(authorName != null && !authorName.isEmpty()) {
            spec = spec.and(ContentSpecification.withAuthorName(authorName));
        }
        if(topicId != null && !topicId.isEmpty()) {
            spec = spec.and(ContentSpecification.withTopicId(topicId));
        }
        if(sortType.equals(Content.SortCategory.VOTES))
        {
            spec = spec.and(ContentSpecification.sortByVote(sortDirection));
        }
        else {
            spec = spec.and(ContentSpecification.sortByTimestamp(sortDirection));
        }
        return spec;
    }

    public ContentFullResponse getContentWithAuthorInfo(UUID id) {
        return contentRepository.getFullBlogInfo(id, SecurityUtils.getName()).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Content with id %s not found", id))
        );
    }
}