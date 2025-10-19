-- ============================================
-- AcadeMeet Database Migration
-- Add Program and Year Level fields to users table
-- Date: 2025-10-19
-- ============================================

USE academeet_db;

-- Check if columns already exist before adding
-- This makes the script safe to run multiple times

-- Add program column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'academeet_db'
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'program'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE users ADD COLUMN program VARCHAR(255) NOT NULL DEFAULT "BSCS"',
    'SELECT "Column program already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add year_level column if it doesn't exist
SET @column_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'academeet_db'
    AND TABLE_NAME = 'users'
    AND COLUMN_NAME = 'year_level'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE users ADD COLUMN year_level INT NOT NULL DEFAULT 1',
    'SELECT "Column year_level already exists" AS message'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Remove default values after adding columns
-- (so new registrations must provide these values)
ALTER TABLE users 
    ALTER COLUMN program DROP DEFAULT,
    ALTER COLUMN year_level DROP DEFAULT;

-- Display updated table structure
DESCRIBE users;

-- Show success message
SELECT 
    'Migration completed successfully!' AS status,
    'Program and Year Level fields added to users table' AS details;
