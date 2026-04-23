-- Nazemny Event Management System - Database Schema
-- Updated with new Subscription Management System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- SUBSCRIPTION PLANS TABLE
-- =====================================================

-- SQL Script to create and populate the subscription_plans table.
-- Please run this in the Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    price NUMERIC NOT NULL,
    features_en JSONB NOT NULL,
    features_ar JSONB NOT NULL,
    tier TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users (public and authenticated)
CREATE POLICY "Allow public read access to subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (true);

-- Restrict insert/update/delete to only be done via supabase dashboard or admin
-- No policies needed for admin, as service_role bypasses RLS.

-- Insert initial current plans
INSERT INTO public.subscription_plans (id, name_en, name_ar, price, features_en, features_ar, tier)
VALUES 
(
  'free', 
  'Free Plan', 
  'الباقة المجانية',
  0, 
  '["Up to 5 events/month", "50 attendees per event", "Email support"]', 
  '["دعم البريد الإلكتروني", "50 مدعو لكل فعالية", "حتى 5 فعاليات شهرياً"]', 
  'free'
),
(
  'premium', 
  'Premium Plan', 
  'الباقة المميزة',
  29, 
  '["Up to 20 events/month", "200 attendees per event", "Priority support"]', 
  '["دعم فني سريع", "200 حاضر لكل فعالية", "حتى 20 فعالية شهرياً"]', 
  'premium'
),
(
  'professional', 
  'Professional Plan', 
  'الباقة الاحترافية',
  99, 
  '["Unlimited events/month", "1000 attendees per event"]', 
  '["1000 حاضر لكل فعالية", "فعاليات غير محدودة شهرياً"]', 
  'professional'
);

-- =====================================================
-- USER SUBSCRIPTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'premium', 'professional')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'pending', 'cancelled')),
  receipt_url TEXT,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  end_date TIMESTAMPTZ,
  events_limit INTEGER NOT NULL,
  events_used INTEGER DEFAULT 0 CHECK (events_used >= 0),
  attendees_limit INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscription requests"
  ON user_subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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
  company TEXT,
  registration_source TEXT DEFAULT 'manual',
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS attendees_event_id_idx ON attendees(event_id);
CREATE INDEX IF NOT EXISTS attendees_ticket_id_idx ON attendees(ticket_id);
CREATE INDEX IF NOT EXISTS attendees_email_idx ON attendees(email);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) FOR EVENTS, TICKETS, ATTENDEES
-- =====================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Users can view their own events" ON events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view event details for registration" ON events FOR SELECT USING (true);
CREATE POLICY "Users can create their own events" ON events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events" ON events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events" ON events FOR DELETE USING (auth.uid() = user_id);

-- Tickets Policies
CREATE POLICY "Users can view tickets for their events" ON tickets FOR SELECT USING (EXISTS (SELECT 1 FROM events WHERE events.id = tickets.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Public can view tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Users can create tickets for their events" ON tickets FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = tickets.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can update tickets for their events" ON tickets FOR UPDATE USING (EXISTS (SELECT 1 FROM events WHERE events.id = tickets.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can delete tickets for their events" ON tickets FOR DELETE USING (EXISTS (SELECT 1 FROM events WHERE events.id = tickets.event_id AND events.user_id = auth.uid()));

-- Attendees Policies
CREATE POLICY "Users can view attendees for their events" ON attendees FOR SELECT USING (EXISTS (SELECT 1 FROM events WHERE events.id = attendees.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Public can view attendees" ON attendees FOR SELECT USING (true);
CREATE POLICY "Users can create attendees for their events" ON attendees FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM events WHERE events.id = attendees.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Anyone can register for an event" ON attendees FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update attendees for their events" ON attendees FOR UPDATE USING (EXISTS (SELECT 1 FROM events WHERE events.id = attendees.event_id AND events.user_id = auth.uid()));
CREATE POLICY "Users can delete attendees for their events" ON attendees FOR DELETE USING (EXISTS (SELECT 1 FROM events WHERE events.id = attendees.event_id AND events.user_id = auth.uid()));

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to handle new user profile creation AND initial free subscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');

  -- Create initial free subscription (valid for 100 years basically)
  INSERT INTO public.user_subscriptions (user_id, tier, status, events_limit, attendees_limit, start_date, end_date)
  VALUES (NEW.id, 'free', 'active', 5, 50, NOW(), NOW() + INTERVAL '100 years');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- STORAGE BUCKETS (Note: Run via Supabase UI or API if possible)
-- =====================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', true);
