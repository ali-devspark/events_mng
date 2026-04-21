import { createClient } from '@/lib/supabase/client'
import { SubscriptionPlan } from '@/types'

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const supabase = createClient()
    
    // Using simple fetch ordered by price to show them correctly left-to-right
    const { data: plans, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price', { ascending: true })

    if (error) {
        console.error('Error fetching subscription plans:', error.message)
        throw new Error(error.message)
    }

    return plans as SubscriptionPlan[]
}
