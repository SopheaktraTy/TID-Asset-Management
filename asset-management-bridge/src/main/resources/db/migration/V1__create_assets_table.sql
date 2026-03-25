CREATE TABLE IF NOT EXISTS assets (
    id BIGSERIAL PRIMARY KEY,
    asset_tag VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100),
    device_name VARCHAR(150) NOT NULL,
    device_type VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    cpu VARCHAR(150),
    ram_gb INTEGER,
    disk_type VARCHAR(50),
    disk_model VARCHAR(150),
    storage_size_gb INTEGER,
    screen_size_inch DOUBLE PRECISION,
    operating_system VARCHAR(100),
    os_version VARCHAR(100),
    domain_joined BOOLEAN DEFAULT FALSE,
    condition VARCHAR(100),
    issue_description TEXT,
    image TEXT,
    last_security_check TIMESTAMP,
    latest_used VARCHAR(255),
    previous_used VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE assets
    ADD CONSTRAINT uk_assets_asset_tag UNIQUE (asset_tag);

ALTER TABLE assets
    ADD CONSTRAINT uk_assets_serial_number UNIQUE (serial_number);