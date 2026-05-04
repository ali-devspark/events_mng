-- -- Add columns to attendees table
-- ALTER TABLE attendees ADD COLUMN IF NOT EXISTS payment_receipt TEXT;
-- ALTER TABLE attendees ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT TRUE;

-- -- Update existing attendees to be confirmed
-- UPDATE attendees SET is_confirmed = TRUE WHERE is_confirmed IS NULL;
