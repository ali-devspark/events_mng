import { createClient } from '@/lib/supabase/client'
import { Event, Ticket, Attendee, EventStats, CreateEventInput, CreateTicketInput, CreateAttendeeInput } from '@/types'

const supabase = createClient()

// =====================================================
// EVENT OPERATIONS
// =====================================================

export async function getEvents() {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })

    if (error) throw error
    return data as Event[]
}

export async function getTodayEvents() {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .order('time', { ascending: true })

    if (error) throw error
    return data as Event[]
}

export async function getEventById(id: string) {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data as Event
}

export async function createEvent(input: CreateEventInput) {
    const { ticket_price, ...eventData } = input
    // Generate unique barcode
    const barcode = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('events')
        .insert({
            ...eventData,
            user_id: user.id,
            barcode,
        })
        .select()
        .single()

    if (error) throw error
    
    if (data.type === 'public') {
        const { error: ticketError } = await supabase
            .from('tickets')
            .insert({
                event_id: data.id,
                name: 'عام',
                quantity: data.max_attendees,
                price: ticket_price || 0,
            })
            
        if (ticketError) {
             console.error("Failed to create general ticket", ticketError);
        }
    }
    
    return data as Event
}

export async function updateEvent(id: string, updates: Partial<CreateEventInput>) {
    const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Event
}

export async function deleteEvent(id: string) {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

    if (error) throw error
}

export async function getEventsByDate(date: string) {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, status')
        .eq('user_id', user.id)
        .eq('date', date)
        .order('time', { ascending: true })

    if (error) throw error
    return data
}

export async function getEventsByMonth(year: number, month: number) {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, status')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })

    if (error) throw error
    return data
}

// =====================================================
// TICKET OPERATIONS
// =====================================================

export async function getTicketsByEventId(eventId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    // Verify ownership of the event first
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('user_id')
        .eq('id', eventId)
        .single()

    if (eventError || event?.user_id !== user.id) {
        throw new Error('Not authorized to view tickets for this event')
    }

    const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data as Ticket[]
}

export async function createTicket(input: CreateTicketInput) {
    const { data, error } = await supabase
        .from('tickets')
        .insert(input)
        .select()
        .single()

    if (error) throw error
    return data as Ticket
}

export async function updateTicket(id: string, updates: Partial<CreateTicketInput>) {
    const { data, error } = await supabase
        .from('tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Ticket
}

export async function deleteTicket(id: string) {
    const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', id)

    if (error) throw error
}

// =====================================================
// ATTENDEE OPERATIONS
// =====================================================

export async function getAttendeesByEventId(eventId: string) {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    // Verify ownership of the event first
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('user_id')
        .eq('id', eventId)
        .single()

    if (eventError || event?.user_id !== user.id) {
        throw new Error('Not authorized to view attendees for this event')
    }

    const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Attendee[]
}

export async function createAttendee(input: CreateAttendeeInput) {
    if (input.ticket_id) {
        // Check ticket availability
        const { data: ticket, error: ticketError } = await supabase
            .from('tickets')
            .select('id, quantity, sold')
            .eq('id', input.ticket_id)
            .single()

        if (ticketError || !ticket) throw new Error('TICKET_NOT_FOUND')
        if (ticket.sold >= ticket.quantity) throw new Error('TICKET_SOLD_OUT')

        // Increment sold count
        await supabase
            .from('tickets')
            .update({ sold: ticket.sold + 1 })
            .eq('id', ticket.id)
    }

    const { data, error } = await supabase
        .from('attendees')
        .insert(input)
        .select()
        .single()

    if (error) throw error
    return data as Attendee
}

export async function createPublicAttendee(input: CreateAttendeeInput) {
    // Check event details
    const { data: event, error: eventError } = await supabase
        .from('events')
        .select('id, type, is_online_registration_enabled')
        .eq('id', input.event_id)
        .single()
        
    if (eventError || !event) throw new Error('EVENT_NOT_FOUND')
    
    if (event.type === 'private' && !event.is_online_registration_enabled) {
        throw new Error('REGISTRATION_DISABLED')
    }

    let ticketId = input.ticket_id;
    
    if (event.type === 'public') {
        const { data: tickets, error: ticketsError } = await supabase
            .from('tickets')
            .select('id, quantity, sold')
            .eq('event_id', event.id)
            .eq('name', 'عام')
            
        if (ticketsError || !tickets || tickets.length === 0) throw new Error('EVENT_SOLD_OUT')
        const generalTicket = tickets[0];
        
        if (generalTicket.sold >= generalTicket.quantity) {
             throw new Error('EVENT_SOLD_OUT')
        }
        ticketId = generalTicket.id;
    }
    
    if (ticketId) {
        const { data: ticket, error: ticketError } = await supabase
            .from('tickets')
            .select('id, quantity, sold')
            .eq('id', ticketId)
            .single()

        if (ticketError || !ticket) throw new Error('TICKET_NOT_FOUND')
        if (ticket.sold >= ticket.quantity) throw new Error('TICKET_SOLD_OUT')

        await supabase
            .from('tickets')
            .update({ sold: ticket.sold + 1 })
            .eq('id', ticketId)
    }

    const { data, error } = await supabase
        .from('attendees')
        .insert({
            ...input,
            ticket_id: ticketId,
            registration_source: 'public_link'
        })
        .select()
        .single()

    if (error) throw error
    return data as Attendee
}

export async function checkInAttendee(id: string) {
    const { data, error } = await supabase
        .from('attendees')
        .update({
            checked_in: true,
            checked_in_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return data as Attendee
}

// =====================================================
// STATISTICS
// =====================================================

export async function getUserEventStats(): Promise<EventStats> {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) throw new Error('Not authenticated')

    // Fetch all events for the user
    const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('id, status')
        .eq('user_id', user.id)

    if (eventsError) throw eventsError

    const eventIds = (events ?? []).map((e) => e.id)

    // Count total attendees across all user events
    let total_attendees = 0
    if (eventIds.length > 0) {
        const { count, error: attendeesError } = await supabase
            .from('attendees')
            .select('id', { count: 'exact', head: true })
            .in('event_id', eventIds)

        if (attendeesError) throw attendeesError
        total_attendees = count ?? 0
    }

    const total_events = events?.length ?? 0
    const upcoming_events = events?.filter((e) => e.status === 'upcoming').length ?? 0
    const ongoing_events = events?.filter((e) => e.status === 'ongoing').length ?? 0
    const finished_events = events?.filter((e) => e.status === 'finished').length ?? 0
    const cancelled_events = events?.filter((e) => e.status === 'cancelled').length ?? 0

    return {
        total_events,
        upcoming_events,
        ongoing_events,
        finished_events,
        cancelled_events,
        total_attendees,
    }
}
