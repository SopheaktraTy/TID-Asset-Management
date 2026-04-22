-- ===========================================================
-- Seeder  : Super Admin User
-- File    : R__super_admin.sql (Flyway Repeatable Migration)
-- Purpose : Ensure SUPER_ADMIN always exists and stays consistent
-- ===========================================================

INSERT INTO users (
    image,
    username,
    email,
    password_hash,
    department,
    job_title,
    role,
    created_at,
    updated_at,
    status
)
VALUES (
    NULL,
    'btc',
    'superadmin@bakertilly.com',
    '$2a$12$uUA8C/omncQsjLtVY9tv3eF5W8vI9.RRmH6meOtcx1v1KzqFfQsWi',  -- btc@001
    'TECHNOLOGY_INNOVATION_DEVELOPMENT',
    'EXECUTIVE',
    'SUPER_ADMIN',
    NOW(),
    NOW(),
    'ACTIVE'
)
ON CONFLICT (email)
DO UPDATE SET
    username   = EXCLUDED.username,
    department = EXCLUDED.department,
    job_title  = EXCLUDED.job_title,
    role       = EXCLUDED.role,
    status     = EXCLUDED.status,
    updated_at = NOW()

-- IMPORTANT:
-- Password is intentionally NOT updated to avoid accidental overwrite
-- If you want to reset password, do it manually or via a secure admin flow
;