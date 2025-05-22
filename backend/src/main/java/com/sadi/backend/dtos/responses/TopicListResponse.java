package com.sadi.backend.dtos.responses;

import java.util.List;

public record TopicListResponse(
        List<TopicDto> topics
) {
}
