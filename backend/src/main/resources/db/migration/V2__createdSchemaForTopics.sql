CREATE TABLE content_topics
(
    id          VARCHAR(255)                NOT NULL,
    description VARCHAR(255)                NOT NULL,
    created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_content_topics PRIMARY KEY (id)
);

ALTER TABLE contents
    ADD topic_id VARCHAR(255);

ALTER TABLE contents
    ADD upvote_count INTEGER;

ALTER TABLE contents
    ALTER COLUMN topic_id SET NOT NULL;

ALTER TABLE contents
    ALTER COLUMN upvote_count SET NOT NULL;

ALTER TABLE contents
    ADD CONSTRAINT FK_CONTENTS_ON_TOPIC FOREIGN KEY (topic_id) REFERENCES content_topics (id);