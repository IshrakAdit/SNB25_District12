package com.sadi.backend.services;

import com.sadi.backend.dtos.responses.TopicDto;
import com.sadi.backend.dtos.requests.ContentTopicCreateRequest;
import com.sadi.backend.entities.ContentTopic;
import com.sadi.backend.repositories.ContentTopicRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ContentTopicService {
    private final ContentTopicRepository contentTopicRepository;

    public ContentTopicService(ContentTopicRepository contentTopicRepository) {
        this.contentTopicRepository = contentTopicRepository;
    }

    public ContentTopic getContentTopic(String id) {
        return contentTopicRepository.findById(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Content topic not found")
        );
    }

    public String  addTopic(@Valid ContentTopicCreateRequest req) {
        Optional<ContentTopic> topic = contentTopicRepository.findById(req.id());
        if (topic.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Content topic already exists");
        }
        return contentTopicRepository.save(new ContentTopic(req.id(), req.description())).getId();
    }

    public void deleteTopic(String id) {
        ContentTopic topic = getContentTopic(id);
        contentTopicRepository.delete(topic);
    }

    public List<TopicDto> getTopics() {
        return contentTopicRepository.findAll().stream()
                .map(topic -> new TopicDto(topic.getId(), topic.getDescription()))
                .collect(Collectors.toList());
    }
}
