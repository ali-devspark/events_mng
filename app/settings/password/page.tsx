'use client'

import { useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'

export default function PasswordSettingsPage() {
    const { updatePassword } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    })

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error: updateError } = await updatePassword(formData.newPassword)

        if (updateError) {
            setError(updateError.message)
        } else {
            setSuccess('Password updated successfully')
            setFormData({ newPassword: '', confirmPassword: '' })
        }

        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <Tabs tabs={tabs} activeTab="password" />

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>

                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        required
                        helperText="Must be at least 6 characters"
                    />

                    <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    )
}
