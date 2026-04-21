'use client'

import { useEffect, useState } from 'react'
import { getActiveSubscription } from '@/lib/api/subscriptions'
import { UserSubscription } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import Link from 'next/link'
import { differenceInDays } from 'date-fns'

export default function SubscriptionBanner() {
    const { language } = useLanguage()
    const [subscription, setSubscription] = useState<UserSubscription | null>(null)

    useEffect(() => {
        async function checkSubscription() {
            try {
                const sub = await getActiveSubscription()
                setSubscription(sub)
            } catch (err) {
                console.error('Error checking subscription for banner:', err)
            }
        }
        checkSubscription()
    }, [])

    if (!subscription || !subscription.end_date) return null

    const daysLeft = differenceInDays(new Date(subscription.end_date), new Date())

    // Show warning if 7 days or less remaining
    if (daysLeft > 7) return null

    const isExpired = daysLeft <= 0

    return (
        <div className={`w-full py-2 px-4 ${isExpired ? 'bg-red-500' : 'bg-yellow-500'} text-white text-center text-sm font-bold animate-pulse-slow relative z-50`}>
            {isExpired ? (
                <span>
                    {language === 'ar' 
                        ? 'انتهى اشتراكك! يرجى التجديد للاستمرار في استخدام النظام.' 
                        : 'Your subscription has expired! Please renew to continue using the system.'}
                </span>
            ) : (
                <span>
                    {language === 'ar' 
                        ? `تنبيه: متبقي ${daysLeft} أيام على انتهاء اشتراكك.` 
                        : `Warning: Only ${daysLeft} days left on your subscription.`}
                </span>
            )}
            <Link 
                href="/settings/plan" 
                className="ms-3 underline hover:no-underline font-extrabold decoration-white/50"
            >
                {language === 'ar' ? 'اصغط للتجديد الآن' : 'Renew Now'}
            </Link>
        </div>
    )
}
