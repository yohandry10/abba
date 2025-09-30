-- Add missing fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Update existing active users to have approved_at set to their updated_at
UPDATE users 
SET approved_at = updated_at 
WHERE status = 'active' AND approved_at IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_approved_at ON users(approved_at);
CREATE INDEX IF NOT EXISTS idx_users_status_role ON users(status, role);