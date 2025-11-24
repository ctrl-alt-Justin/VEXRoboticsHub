-- Add authentication columns to team_members table
-- Run this in Supabase SQL Editor

-- Add email column (unique, required)
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Add password_hash column
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- For existing rows, we can optionally set a default email pattern
-- UPDATE team_members SET email = CONCAT(LOWER(REPLACE(name, ' ', '')), '@example.com') WHERE email IS NULL;

-- Make email required for NEW entries only (existing rows can keep NULL)
-- Uncomment the next line after updating existing rows with emails
-- ALTER TABLE team_members ALTER COLUMN email SET NOT NULL;
