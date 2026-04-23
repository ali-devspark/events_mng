ALTER TABLE events ADD COLUMN category TEXT;
ALTER TABLE events ADD COLUMN type TEXT DEFAULT 'public';
ALTER TABLE events ADD COLUMN is_online_registration_enabled BOOLEAN DEFAULT true;
