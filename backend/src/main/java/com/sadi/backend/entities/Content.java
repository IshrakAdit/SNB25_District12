package com.sadi.backend.entities;

import com.sadi.backend.dtos.BaseSortCategory;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "contents")
public class Content {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id", nullable = false)
    @ToString.Exclude
    private ContentTopic topic;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String coverPhoto;

    @Column(nullable = false, length = 1000)
    private String summary;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(name = "upvote_count", nullable = false)
    private Integer upvoteCount;

    @CreatedDate
    @Column(nullable = false)
    private Instant createdAt;

    @OneToMany(mappedBy = "content", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<ContentVote> contentVotes;

    public Content(User user, String title, ContentTopic topic, String coverPhoto, String summary, String body) {
        this.user = user;
        this.title = title;
        this.body = body;
        this.topic = topic;
        this.coverPhoto = coverPhoto;
        this.summary = summary;
        this.createdAt = Instant.now();
        this.upvoteCount = 0;
    }

    @Getter
    @RequiredArgsConstructor
    public enum SortCategory implements BaseSortCategory {
        CREATED_AT("createdAt"),
        VOTES("voteCount");

        private final String value;
    }
}
