CREATE TABLE content_votes
(
    id         UUID         NOT NULL,
    user_id    VARCHAR(255) NOT NULL,
    content_id UUID         NOT NULL,
    CONSTRAINT pk_content_votes PRIMARY KEY (id)
);

CREATE TABLE contents
(
    id         UUID                        NOT NULL,
    user_id    VARCHAR(255)                NOT NULL,
    title      VARCHAR(255)                NOT NULL,
    body       TEXT                        NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_contents PRIMARY KEY (id)
);

CREATE TABLE project_responses
(
    id          UUID                        NOT NULL,
    user_id     VARCHAR(255)                NOT NULL,
    bkash       VARCHAR(20),
    project_id  UUID                        NOT NULL,
    body        TEXT                        NOT NULL,
    is_varified BOOLEAN                     NOT NULL,
    created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_project_responses PRIMARY KEY (id)
);

CREATE TABLE projects
(
    id         UUID                        NOT NULL,
    user_id    VARCHAR(255)                NOT NULL,
    title      VARCHAR(255)                NOT NULL,
    body       TEXT                        NOT NULL,
    type       VARCHAR(255)                NOT NULL,
    priority   INTEGER                     NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_projects PRIMARY KEY (id)
);

CREATE TABLE users
(
    id              VARCHAR(255)                NOT NULL,
    email           VARCHAR(50)                 NOT NULL,
    full_name       VARCHAR(255)                NOT NULL,
    role            VARCHAR(20)                 NOT NULL,
    profile_picture VARCHAR(1000),
    credit          BIGINT                      NOT NULL,
    score           BIGINT                      NOT NULL,
    created_at      TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE contents
    ADD CONSTRAINT FK_CONTENTS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE content_votes
    ADD CONSTRAINT FK_CONTENT_VOTES_ON_CONTENT FOREIGN KEY (content_id) REFERENCES contents (id);

ALTER TABLE content_votes
    ADD CONSTRAINT FK_CONTENT_VOTES_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE projects
    ADD CONSTRAINT FK_PROJECTS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE project_responses
    ADD CONSTRAINT FK_PROJECT_RESPONSES_ON_PROJECT FOREIGN KEY (project_id) REFERENCES projects (id);

ALTER TABLE project_responses
    ADD CONSTRAINT FK_PROJECT_RESPONSES_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);