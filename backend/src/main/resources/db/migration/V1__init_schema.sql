CREATE TABLE app_metadata (
    metadata_key VARCHAR(64) PRIMARY KEY,
    metadata_value VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_metadata (metadata_key, metadata_value)
VALUES
    ('application', 'vllm-fleet-control'),
    ('stage', 'M0');
