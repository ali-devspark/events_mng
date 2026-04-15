'use client'

import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileSettingsPage() {
    const { user } = useAuth()
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

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

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} currentTab="profile" />

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form className="space-y-6 mt-6">
                    <Input
                        label="Email"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        helperText="Email cannot be changed"
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        value={user?.phone || ''}
                        disabled
                        helperText="Phone number cannot be changed"
                    />

                    <div className="pt-4">
                        <p className="text-sm text-gray-400 mb-4">
                            Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-400">
                            User ID: <span className="font-mono text-xs">{user?.id}</span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
