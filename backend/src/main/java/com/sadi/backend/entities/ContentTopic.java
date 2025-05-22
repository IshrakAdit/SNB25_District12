package com.sadi.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "content_topics")
public class ContentTopic {
    @Id
    private String id;

    @Column(nullable = false)
    private String description;

    @CreatedDate
    @Column(nullable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "topic", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Content> contents;

    public ContentTopic(String id, String description) {
        this.id = id;
        this.description = description;
        createdAt = Instant.now();
    }
}
