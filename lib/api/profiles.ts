import { createClient } from '@/lib/supabase/client'
import { Profile, SubscriptionTier } from '@/types'

const supabase = createClient()

export async function getProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

    if (error) throw error
    return data as Profile | null
}

export async function updateProfile(updates: Partial<Profile>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()

    if (error) throw error
    return data as Profile
}

export async function upgradeSubscription(tier: SubscriptionTier) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Define limits for each tier
    const limits = {
        free: { max_events: 5, max_attendees: 50 },
        premium: { max_events: 20, max_attendees: 200 },
        professional: { max_events: 100, max_attendees: 1000 }
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({
            subscription_tier: tier,
            max_events_per_month: limits[tier].max_events,
            max_attendees_per_event: limits[tier].max_attendees
        })
        .eq('id', user.id)
        .select()
        .single()

    if (error) throw error
    return data as Profile
}
