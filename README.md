# Nazemny - Event Management System

A comprehensive, production-ready event management system built with Next.js 14, React 18, TypeScript, Tailwind CSS, and Supabase. Nazemny empowers you to create, manage, and track events with ease.

## Features

### 📅 Event Management
- **Create & Edit Events**: Detailed event creation with title, description, date, time, and location.
- **Status Tracking**: Monitor event verify status (Upcoming, Ongoing, Finished, Cancelled).
- **Capacity Management**: Set maximum and required attendee limits.
- **Barcode Integration**: Unique barcodes for event identification.

### 🎫 Ticketing System
- **Multiple Ticket Types**: Support for Free, Paid, VIP, General, and Early Bird tickets.
- **Inventory Control**: Manage ticket quantity and pricing.
- **Sales Tracking**: Monitor ticket sales in real-time.

### � Attendee Management
- **Guest Lists**: Manage attendees with detailed profiles (Name, Email, Phone).
- **Check-in System**: Digital check-in functionality with timestamp tracking.
- **Real-time Status**: Track who has arrived and who is pending.

### 📊 Dashboard & Analytics
- **Overview Stats**: Instant view of total events, upcoming schedules, and attendee counts.
- **Visual Reports**: Data visualization for event performance.
- **Recent Activity**: Quick access to recently created or modified events.

### 🗓️ Calendar Integration
- **Interactive Calendar**: Monthly, weekly, and daily views of your event schedule.
- **Quick Navigation**: Jump directly to event details from the calendar interface.

### 🔐 Robust Authentication
- **Multi-method Auth**: Email/Password and Phone (SMS OTP) authentication.
- **Security**: Protected routes, session management, and secure password handling.
- **User Management**: Registration, Login, Forgot Password, and Email Verification flows.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Glassmorphism Design
- **Database & Auth**: Supabase
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Date Handling**: date-fns
- **Charts**: Recharts
- **QR Codes**: qrcode

## Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migration SQL provided in `supabase-migration.sql` in your Supabase SQL Editor to set up the database schema.
3. Go to **Project Settings** → **API**
4. Copy your **Project URL** and **anon/public key**

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Nazemny/
├── app/                      # Next.js 14 App Router
│   ├── calendar/            # Calendar view
│   ├── dashboard/           # Analytics dashboard
│   ├── events/              # Event management (CRUD)
│   ├── login/               # Authentication pages
│   ├── register/            # User registration
│   ├── settings/            # User settings
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/
│   ├── dashboard/           # Dashboard specific widgets
│   ├── events/              # Event cards and forms
│   ├── layout/              # Sidebar and Header
│   ├── ui/                  # Reusable UI components
│   └── auth/                # Auth forms
├── lib/
│   ├── api/                 # API client functions
│   ├── supabase/            # Supabase configuration
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript interfaces (Event, Ticket, Attendee)
└── supabase-migration.sql   # Database schema definitions
```

## Database Schema

The system uses a relational database structure:

- **Events**: Stores core event information.
- **Tickets**: Ticket types and inventory linked to events.
- **Attendees**: Records of users registered for events.
- **Profiles**: User profile information linked to auth.users.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions:
- Visit [Supabase Documentation](https://supabase.com/docs)
- Review [Next.js Documentation](https://nextjs.org/docs)
