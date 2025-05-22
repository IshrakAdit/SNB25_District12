package com.sadi.backend.entities;

import com.sadi.backend.dtos.BaseSortCategory;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;
import java.util.UUID;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "project_responses")
public class ProjectResponse {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @Column(length = 20)
    private String bkash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    @ToString.Exclude
    private Project project;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String body;

    @Column(nullable = false)
    private Boolean isVarified;

    @CreatedDate
    @Column(nullable = false)
    private Instant createdAt;

    public ProjectResponse(User user, Project project, String body, String bkash) {
        this.user = user;
        this.project = project;
        this.body = body;
        this.bkash = bkash;
        this.createdAt = Instant.now();
        this.isVarified = false;
    }

    @Getter
    @RequiredArgsConstructor
    public enum SortCategory implements BaseSortCategory {
        CREATED_AT("createdAt");

        private final String value;
    }
}
