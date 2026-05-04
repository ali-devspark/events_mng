// TypeScript types for Nazemny Event Management System

export interface Event {
    id: string
    user_id: string
    title: string
    description?: string
    date: string
    time: string
    location: string
    max_attendees: number
    barcode: string
    status: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
    category: string
    type: 'public' | 'private'
    is_online_registration_enabled: boolean
    created_at: string
    updated_at: string
}

export type SubscriptionTier = 'free' | 'premium' | 'professional'

export interface Profile {
    id: string
    full_name: string | null
    avatar_url: string | null
    created_at: string
    updated_at: string
}

export type SubscriptionStatus = 'active' | 'disabled' | 'pending' | 'cancelled'

export interface UserSubscription {
    id: string
    user_id: string
    tier: SubscriptionTier
    status: SubscriptionStatus
    receipt_url: string | null
    start_date: string
    end_date: string | null
    events_limit: number
    events_used: number
    attendees_limit: number
    created_at: string
    updated_at: string
}

export interface Ticket {
    id: string
    event_id: string
    name: string
    quantity: number
    price: number
    sold: number
    created_at: string
    updated_at: string
}

export interface Attendee {
    id: string
    event_id: string
    ticket_id?: string
    name: string
    email: string
    phone?: string
    company?: string
    registration_source: 'manual' | 'public_link'
    checked_in: boolean
    checked_in_at?: string
    payment_receipt?: string
    is_confirmed: boolean
    created_at: string
    tickets?: {
        name: string
    }
}

export interface EventStats {
    total_events: number
    upcoming_events: number
    ongoing_events: number
    finished_events: number
    cancelled_events: number
    total_attendees: number
}

export interface CreateEventInput {
    title: string
    description?: string
    date: string
    time: string
    location: string
    max_attendees: number
    category: string
    type: 'public' | 'private'
    is_online_registration_enabled: boolean
    ticket_price?: number
}

export interface CreateTicketInput {
    event_id: string
    name: string
    quantity: number
    price: number
}

export interface CreateAttendeeInput {
    event_id: string
    ticket_id?: string
    name: string
    email: string
    phone?: string
    company?: string
    registration_source?: string
    payment_receipt?: string
    is_confirmed?: boolean
}

export interface EventWithTickets extends Event {
    tickets: Ticket[]
    attendee_count: number
}

export interface CalendarEvent {
    id: string
    title: string
    date: string
    time: string
    location: string
    status: Event['status']
}

export interface SubscriptionPlan {
    id: string
    name_en: string
    name_ar: string
    price: number
    features_en: string[]
    features_ar: string[]
    tier: SubscriptionTier
    created_at?: string
    updated_at?: string
}
