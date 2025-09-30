-- Insert default admin user
-- Password: Admin123! (you should change this after first login)
-- This is a bcrypt hash, you'll need to update it with actual Supabase auth
INSERT INTO users (email, password_hash, role, status, full_name)
VALUES (
  'admin@casadecambio.com',
  '$2a$10$rKZLvXZnJZ0YvXZnJZ0YvXZnJZ0YvXZnJZ0YvXZnJZ0YvXZnJZ0Y',
  'admin',
  'active',
  'Administrador'
);

-- Insert initial exchange rate
INSERT INTO exchange_rates (
  soles_to_bolivares,
  bolivares_to_soles,
  published_by,
  is_active
)
SELECT
  13.5000,
  0.0741,
  id,
  TRUE
FROM users WHERE email = 'admin@casadecambio.com';
