-- ============================================================
-- Seeder  : Super Admin User
-- File    : R__super_admin.sql         (Flyway Repeatable migration)
-- Runs    : Every time the file checksum changes
-- ============================================================
-- Password : btc@001
-- Hash     : BCrypt (cost 12)
-- Regenerate: https://bcrypt-generator.com → password "btc@001", rounds = 12
-- ============================================================

INSERT INTO users (image, username, email, password_hash, department, role, created_at, updated_at, is_active)
VALUES (
    NULL,
    'btc',
    'superadmin@bakertilly.com',
    '$2a$12$uUA8C/omncQsjLtVY9tv3eF5W8vI9.RRmH6meOtcx1v1KzqFfQsWi',  -- btc@001
    'TECHNOLOGY_INNOVATION_DEVELOPMENT',                                 -- DepartmentEnum constant
    'SUPER_ADMIN',
    NOW(),
    NOW(),
    TRUE
) ON CONFLICT (email) DO UPDATE SET
    username        = EXCLUDED.username,
    role            = EXCLUDED.role,
    department      = EXCLUDED.department,
    password_hash   = EXCLUDED.password_hash,
    is_active       = EXCLUDED.is_active;
