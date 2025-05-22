package com.sadi.backend.repositories;

import com.sadi.backend.entities.ContentTopic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContentTopicRepository extends JpaRepository<ContentTopic, String> {
}
