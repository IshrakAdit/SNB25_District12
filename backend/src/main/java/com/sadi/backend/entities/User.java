package com.sadi.backend.entities;

import com.sadi.backend.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.Instant;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Table(name = "users")
public class User {
    @Id
    private String id;

    @Column(unique = true, nullable = false, length = 50)
    private String email;

    @Column(nullable = false)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(length = 1000)
    private String profilePicture;

    @Column(nullable = false)
    private Long credit;

    @Column(nullable = false)
    private Long score;

    @CreatedDate
    @Column(nullable = false)
    private Instant createdAt;


    public User(String id) {
        this.id = id;
    }

    public User(String id, String email, String fullName, Role role) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }
}
