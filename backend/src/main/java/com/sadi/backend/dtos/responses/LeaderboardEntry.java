package com.sadi.backend.dtos.responses;

public interface LeaderboardEntry {
    Long getId();
    String getFullName();
    String getProfilePicture();
    Integer getScore();
    Integer getRank();
}
