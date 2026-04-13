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
    required_attendees: number
    barcode: string
    status: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
    created_at: string
    updated_at: string
}

export interface Ticket {
    id: string
    event_id: string
    name: string
    type: 'free' | 'paid' | 'vip' | 'general' | 'early-bird'
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
    checked_in: boolean
    checked_in_at?: string
    created_at: string
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
    required_attendees?: number
}

export interface CreateTicketInput {
    event_id: string
    name: string
    type: 'free' | 'paid' | 'vip' | 'general' | 'early-bird'
    quantity: number
    price: number
}

export interface CreateAttendeeInput {
    event_id: string
    ticket_id?: string
    name: string
    email: string
    phone?: string
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
    status: Event['status']
}
