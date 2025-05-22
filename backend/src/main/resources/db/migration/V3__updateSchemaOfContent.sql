ALTER TABLE contents
    ADD cover_photo VARCHAR(1000);

ALTER TABLE contents
    ADD summary VARCHAR(1000);


ALTER TABLE contents
    ALTER COLUMN cover_photo SET NOT NULL;

ALTER TABLE contents
    ALTER COLUMN summary SET NOT NULL;