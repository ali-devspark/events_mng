-- Nazemly Event Management System - Database Schema
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- EVENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  max_attendees INTEGER NOT NULL CHECK (max_attendees > 0),
  required_attendees INTEGER DEFAULT 0 CHECK (required_attendees >= 0),
  barcode TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'finished', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);
CREATE INDEX IF NOT EXISTS events_status_idx ON events(status);

-- =====================================================
-- TICKETS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('free', 'paid', 'vip', 'general', 'early-bird')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) DEFAULT 0 CHECK (price >= 0),
  sold INTEGER DEFAULT 0 CHECK (sold >= 0 AND sold <= quantity),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS tickets_event_id_idx ON tickets(event_id);

-- =====================================================
-- ATTENDEES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS attendees_event_id_idx ON attendees(event_id);
CREATE INDEX IF NOT EXISTS attendees_ticket_id_idx ON attendees(ticket_id);
CREATE INDEX IF NOT EXISTS attendees_email_idx ON attendees(email);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Users can view their own events"
  ON events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  USING (auth.uid() = user_id);

-- Tickets Policies
CREATE POLICY "Users can view tickets for their events"
  ON tickets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tickets for their events"
  ON tickets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tickets for their events"
  ON tickets FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tickets for their events"
  ON tickets FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = tickets.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Attendees Policies
CREATE POLICY "Users can view attendees for their events"
  ON attendees FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendees.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create attendees for their events"
  ON attendees FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendees.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update attendees for their events"
  ON attendees FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendees.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete attendees for their events"
  ON attendees FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = attendees.event_id
      AND events.user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get event statistics for a user
CREATE OR REPLACE FUNCTION get_user_event_stats(user_uuid UUID)
RETURNS JSON AS $$
DECLARE
  stats JSON;
BEGIN
  SELECT json_build_object(
    'total_events', COUNT(*),
    'upcoming_events', COUNT(*) FILTER (WHERE status = 'upcoming'),
    'ongoing_events', COUNT(*) FILTER (WHERE status = 'ongoing'),
    'finished_events', COUNT(*) FILTER (WHERE status = 'finished'),
    'cancelled_events', COUNT(*) FILTER (WHERE status = 'cancelled'),
    'total_attendees', (
      SELECT COUNT(*)
      FROM attendees a
      JOIN events e ON a.event_id = e.id
      WHERE e.user_id = user_uuid
    )
  )
  INTO stats
  FROM events
  WHERE user_id = user_uuid;
  
  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate ticket quantity against max attendees
CREATE OR REPLACE FUNCTION validate_ticket_quantity()
RETURNS TRIGGER AS $$
DECLARE
  total_tickets INTEGER;
  event_max_attendees INTEGER;
BEGIN
  -- Get total tickets for this event (including the new/updated one)
  SELECT COALESCE(SUM(quantity), 0) + NEW.quantity
  INTO total_tickets
  FROM tickets
  WHERE event_id = NEW.event_id
  AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);
  
  -- Get max attendees for the event
  SELECT max_attendees
  INTO event_max_attendees
  FROM events
  WHERE id = NEW.event_id;
  
  -- Validate
  IF total_tickets > event_max_attendees THEN
    RAISE EXCEPTION 'Total ticket quantity (%) exceeds event max attendees (%)', 
      total_tickets, event_max_attendees;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to validate ticket quantity
CREATE TRIGGER validate_ticket_quantity_trigger
  BEFORE INSERT OR UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION validate_ticket_quantity();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data
/*
INSERT INTO events (user_id, title, description, date, time, location, max_attendees, required_attendees, barcode, status)
VALUES 
  (auth.uid(), 'Tech Conference 2024', 'Annual technology conference', '2024-06-15', '09:00:00', 'Convention Center', 500, 100, 'EVT-TECH-2024-001', 'upcoming'),
  (auth.uid(), 'Music Festival', 'Summer music festival', '2024-07-20', '18:00:00', 'City Park', 1000, 0, 'EVT-MUSIC-2024-002', 'upcoming');
*/
