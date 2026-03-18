CREATE TABLE asset_assignments (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL REFERENCES assets(id),
    assigned_to VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    job_title VARCHAR(100),
    assigned_by VARCHAR(100),
    assigned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    returned_date DATE,
    return_condition VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
