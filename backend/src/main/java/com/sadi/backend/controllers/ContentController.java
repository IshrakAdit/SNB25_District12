package com.sadi.backend.controllers;

import com.sadi.backend.dtos.responses.TopicDto;
import com.sadi.backend.dtos.requests.ContentCreateUpdateRequest;
import com.sadi.backend.dtos.requests.ContentTopicCreateRequest;
import com.sadi.backend.dtos.responses.ContentFullResponse;
import com.sadi.backend.dtos.responses.ContentShortResponse;
import com.sadi.backend.dtos.responses.TopicListResponse;
import com.sadi.backend.dtos.responses.VoteResponse;
import com.sadi.backend.entities.Content;
import com.sadi.backend.services.ContentService;
import com.sadi.backend.services.ContentTopicService;
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
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/v1/contents")
@Slf4j
public class ContentController {
    private final ContentService contentService;
    private final ContentTopicService contentTopicService;

    public ContentController(ContentService contentService, ContentTopicService contentTopicService) {
        this.contentService = contentService;
        this.contentTopicService = contentTopicService;
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ContentCreateUpdateRequest req) {
        log.debug("Request to create a content received with {}", req);
        UUID id = contentService.addContent(req);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri()
                .path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update (
            @Valid @RequestBody ContentCreateUpdateRequest req,
            @PathVariable UUID id
    ) {
        log.debug("Request to update a content received with {}", req);
        contentService.updateContent(id, req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete (
            @PathVariable UUID id
    ){
        log.debug("Request to delete a content received with {}", id);
        contentService.deleteContent(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/vote")
    public ResponseEntity<VoteResponse> vote (
            @PathVariable UUID id
    ){
        log.debug("vote for content with id: {}", id);
        int val = contentService.voteContent(id);
        return ResponseEntity.ok(new VoteResponse(val));
    }

    @GetMapping
    public ResponseEntity<PagedModel<ContentShortResponse>> getAll (
            @RequestParam(required = false, defaultValue = "1000-01-01") LocalDate startDate,
            @RequestParam(required = false, defaultValue = "9999-12-31") LocalDate endDate,
            @RequestParam(required = false) String authorId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String authorName,
            @RequestParam(required = false) String topicId,
            @RequestParam(required = false, defaultValue = "VOTES") Content.SortCategory sortType,
            @RequestParam(required = false, defaultValue = "DESC") Sort.Direction sortDirection,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "10") Integer size,
            @RequestParam(required = false, defaultValue = "Asia/Dhaka") String zoneId
    ){
        log.debug("Req to get blogs");
        Pageable pageable = PageRequest.of(page, size);
        Instant startTime = startDate.atStartOfDay().atZone(ZoneId.of(zoneId)).toInstant();
        Instant endTime = endDate.atTime(23, 58).atZone(ZoneId.of(zoneId)).toInstant();
        Specification<Content> spec = contentService.getSpecification(
                startTime,
                endTime,
                authorId,
                title,
                authorName,
                topicId,
                sortType,
                sortDirection
        );

        Page<ContentShortResponse> res = contentService.filterContents(spec, pageable);
        return ResponseEntity.ok(new PagedModel<>(res));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContentFullResponse> getFullBlog(
            @PathVariable UUID id
    ){
        log.debug("get blog with id: {}", id);
        return ResponseEntity.ok(contentService.getContentWithAuthorInfo(id));
    }

    @PostMapping("/topics")
    public ResponseEntity<Void> createTopic(@Valid @RequestBody ContentTopicCreateRequest req) {
        log.debug("Request to create a content topic received with {}", req);
        String id = contentTopicService.addTopic(req);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequestUri()
                .path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @DeleteMapping("/topics/{id}")
    public ResponseEntity<Void> deleteTopic(
            @PathVariable String id
    ) {
        contentTopicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/topics")
    public ResponseEntity<TopicListResponse> getTopics() {
        List<TopicDto> topics = contentTopicService.getTopics();
        return ResponseEntity.ok(new TopicListResponse(topics));
    }
}
