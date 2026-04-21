'use client'

import { useEffect, useState } from 'react'
import { getActiveSubscription } from '@/lib/api/subscriptions'
import { UserSubscription } from '@/types'

export function useSubscription() {
    const [subscription, setSubscription] = useState<UserSubscription | null>(null)
    const [loading, setLoading] = useState(true)

    const refreshSubscription = async () => {
        setLoading(true)
        try {
            const sub = await getActiveSubscription()
            setSubscription(sub)
        } catch (err) {
            console.error('Error fetching subscription in hook:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshSubscription()
    }, [])

    const isFeatureAllowed = (feature: 'create_event' | 'attendees') => {
        if (!subscription) return false
        if (subscription.status !== 'active') return false
        
        // Basic check for event creation
        if (feature === 'create_event') {
            return subscription.events_used < subscription.events_limit
        }
        
        return true
    }

    return {
        subscription,
        loading,
        refreshSubscription,
        isFeatureAllowed,
        eventsRemaining: subscription ? subscription.events_limit - subscription.events_used : 0
    }
}
