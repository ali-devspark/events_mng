'use client'

import Tabs from '@/components/ui/Tabs'
import Button from '@/components/ui/Button'

export default function PlanSettingsPage() {
    const tabs = [
        {
            id: 'profile',
            label: 'Profile',
            href: '/settings/profile',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            id: 'password',
            label: 'Password',
            href: '/settings/password',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            ),
        },
        {
            id: 'plan',
            label: 'Plan',
            href: '/settings/plan',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ]

    const plans = [
        {
            name: 'Free',
            price: '$0',
            period: '/month',
            features: [
                'Up to 5 events',
                'Up to 100 attendees per event',
                'Basic analytics',
                'Email support',
            ],
            current: true,
        },
        {
            name: 'Pro',
            price: '$29',
            period: '/month',
            features: [
                'Unlimited events',
                'Unlimited attendees',
                'Advanced analytics',
                'Priority support',
                'Custom branding',
                'API access',
            ],
            current: false,
        },
        {
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            features: [
                'Everything in Pro',
                'Dedicated account manager',
                'Custom integrations',
                'SLA guarantee',
                'White-label solution',
                'Advanced security',
            ],
            current: false,
        },
    ]

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} currentTab="plan" />

            <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                    <h2 className="text-xl font-bold text-white mb-2">Current Plan</h2>
                    <p className="text-gray-400 mb-6">You are currently on the Free plan</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`
                  bg-white/5 border rounded-xl p-6 transition-all
                  ${plan.current
                                        ? 'border-primary-500 ring-2 ring-primary-500/20'
                                        : 'border-white/10 hover:border-primary-500/50'
                                    }
                `}
                            >
                                <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-gray-400">{plan.period}</span>
                                </div>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                            <svg className="w-5 h-5 text-success-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={plan.current ? 'outline' : 'primary'}
                                    fullWidth
                                    disabled={plan.current}
                                >
                                    {plan.current ? 'Current Plan' : 'Upgrade'}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
