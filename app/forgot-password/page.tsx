'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error: resetError } = await resetPassword(email)

        if (resetError) {
            setError(resetError.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <AuthLayout
                title="Check Your Email"
                subtitle="Password reset link sent"
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                    </div>
                    <Alert
                        type="success"
                        message={`We've sent a password reset link to ${email}. Please check your inbox and follow the instructions.`}
                    />
                    <div className="pt-4 space-y-3">
                        <Link href="/login">
                            <Button variant="primary" fullWidth>
                                Back to Login
                            </Button>
                        </Link>
                        <button
                            onClick={() => setSuccess(false)}
                            className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
                        >
                            Try another email
                        </button>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title="Forgot Password?"
            subtitle="Enter your email to reset your password"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <Alert
                    type="info"
                    message="Enter the email address associated with your account and we'll send you a link to reset your password."
                />

                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                <Button type="submit" variant="primary" fullWidth loading={loading}>
                    Send Reset Link
                </Button>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                        ← Back to login
                    </Link>
                </div>
            </form>
        </AuthLayout>
    )
}
