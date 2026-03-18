CREATE TABLE asset_procurements (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL UNIQUE REFERENCES assets(id),
    purchase_date DATE,
    purchase_vendor VARCHAR(255),
    purchase_cost NUMERIC(15, 2) CHECK (purchase_cost >= 0),
    warranty_expiry_date DATE CHECK (warranty_expiry_date >= purchase_date),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
