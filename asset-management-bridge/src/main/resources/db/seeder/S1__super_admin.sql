-- ============================================================
-- Seeder: Super Admin User
-- File   : S1__super_admin.sql
-- Run    : Manually against your PostgreSQL database
--          or via Spring sql.init.data-locations config
-- ============================================================
-- Password : btc@001
-- Hash      : BCrypt (cost 10)
-- To regenerate hash, use an online BCrypt generator:
--   https://bcrypt-generator.com  →  enter password "btc@001", rounds = 10
-- ============================================================

INSERT INTO users (image, username, email, password_hash, department, role, created_at, updated_at, is_active)
VALUES (
    NULL,
    'btc',
    'superadmin@bakertilly.com',
    '$2a$12$uUA8C/omncQsjLtVY9tv3eF5W8vI9.RRmH6meOtcx1v1KzqFfQsWi',  -- btc@001
    , -- department
    'SUPER_ADMIN',
    NOW(),
    NOW(),
    TRUE
) ON CONFLICT (email) DO UPDATE SET
    username = EXCLUDED.username,
    role = EXCLUDED.role,
    password_hash = EXCLUDED.password_hash;
