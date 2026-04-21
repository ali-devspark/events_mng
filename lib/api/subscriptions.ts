import { createClient } from '@/lib/supabase/client'
import { UserSubscription, SubscriptionTier } from '@/types'

const supabase = createClient()

export async function getActiveSubscription(): Promise<UserSubscription | null> {
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) return null

    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle()

    if (error) throw error
    return data as UserSubscription | null
}

export async function getPendingSubscription(): Promise<UserSubscription | null> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle()

    if (error) throw error
    return data as UserSubscription | null
}

export async function createSubscriptionRequest(tier: SubscriptionTier, receiptUrl: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Define limits based on tier
    const limits = {
        free: { events: 5, attendees: 50 },
        premium: { events: 20, attendees: 200 },
        professional: { events: 100, attendees: 1000 }
    }

    const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
            user_id: user.id,
            tier: tier,
            status: 'pending',
            receipt_url: receiptUrl,
            events_limit: limits[tier].events,
            attendees_limit: limits[tier].attendees,
            events_used: 0
        })
        .select()
        .single()

    if (error) throw error
    return data as UserSubscription
}

/**
 * Temporary helper for testing approval flow
 */
export async function simulateApproval(subscriptionId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // 1. Cancel existing active subscription
    await supabase
        .from('user_subscriptions')
        .update({ status: 'cancelled' })
        .eq('user_id', user.id)
        .eq('status', 'active')

    // 2. Approve new subscription
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(startDate.getFullYear() + 1)

    const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
            status: 'active',
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString()
        })
        .eq('id', subscriptionId)
        .eq('status', 'pending')
        .select()
        .single()

    if (error) throw error
    return data as UserSubscription
}

export async function uploadReceipt(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `receipts/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(filePath)

    return publicUrl
}

export async function incrementSubscriptionUsage(subscriptionId: string) {
    const { data: current } = await supabase
        .from('user_subscriptions')
        .select('events_used')
        .eq('id', subscriptionId)
        .single()
    
    const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({ events_used: (current?.events_used || 0) + 1 })
        .eq('id', subscriptionId)
        
    if (updateError) throw updateError
}
