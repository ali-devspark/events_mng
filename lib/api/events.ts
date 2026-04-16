import { createClient } from '@/lib/supabase/client'
import { Event, Ticket, Attendee, EventStats, CreateEventInput, CreateTicketInput, CreateAttendeeInput } from '@/types'

const supabase = createClient()

// =====================================================
// EVENT OPERATIONS
// =====================================================

export async function getEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

    if (error) throw error
    return data as Event[]
}

export async function getTodayEvents() {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
        .from('events')
        .select('*')
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
    // Generate unique barcode
    const barcode = `EVT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('events')
        .insert({
            ...input,
            user_id: user.id,
            barcode,
            required_attendees: input.required_attendees || 0,
        })
        .select()
        .single()

    if (error) throw error
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
    const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, status')
        .eq('date', date)
        .order('time', { ascending: true })

    if (error) throw error
    return data
}

export async function getEventsByMonth(year: number, month: number) {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    // Calculate the actual last day of the month (handles 28/29/30/31 correctly)
    const lastDay = new Date(year, month, 0).getDate()
    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

    const { data, error } = await supabase
        .from('events')
        .select('id, title, date, time, status')
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
    const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data as Attendee[]
}

export async function createAttendee(input: CreateAttendeeInput) {
    const { data, error } = await supabase
        .from('attendees')
        .insert(input)
        .select()
        .single()

    if (error) throw error
    return data as Attendee
}

export async function createPublicAttendee(input: CreateAttendeeInput) {
    const { data, error } = await supabase
        .from('attendees')
        .insert({
            ...input,
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .rpc('get_user_event_stats', { user_uuid: user.id })

    if (error) throw error
    return data as EventStats
}
