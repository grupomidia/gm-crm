-- Migration: Add logistics column to form_responses table
-- Execute this in Supabase SQL Editor

-- Add logistics column if it doesn't exist
ALTER TABLE form_responses 
ADD COLUMN IF NOT EXISTS logistics jsonb DEFAULT '{}';

-- Verify the column was added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'form_responses' AND column_name = 'logistics';
