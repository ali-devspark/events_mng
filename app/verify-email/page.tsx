'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'

export default function VerifyEmailPage() {
    const router = useRouter()
    const { user, resendVerificationEmail } = useAuth()
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('success')

    useEffect(() => {
        if (user?.email_confirmed_at) {
            router.push('/dashboard')
        }
    }, [user, router])

    const handleResend = async () => {
        setLoading(true)
        setMessage('')

        const { error } = await resendVerificationEmail()

        if (error) {
            setMessageType('error')
            setMessage(error.message)
        } else {
            setMessageType('success')
            setMessage('Verification email sent! Please check your inbox.')
        }

        setLoading(false)
    }

    return (
        <AuthLayout
            title="Verify Your Email"
            subtitle="Check your inbox for verification link"
        >
            <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto bg-primary-500/10 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                    </svg>
                </div>

                <div>
                    <p className="text-gray-300 mb-4">
                        We've sent a verification link to:
                    </p>
                    <p className="text-white font-medium text-lg">{user?.email}</p>
                </div>

                {message && (
                    <Alert
                        type={messageType}
                        message={message}
                        onClose={() => setMessage('')}
                    />
                )}

                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-gray-300 text-left space-y-2">
                    <p className="font-medium text-white">Next steps:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Check your email inbox</li>
                        <li>Click the verification link</li>
                        <li>Return here to access your account</li>
                    </ol>
                </div>

                <div className="space-y-3 pt-2">
                    <Button
                        onClick={handleResend}
                        variant="primary"
                        fullWidth
                        loading={loading}
                    >
                        Resend Verification Email
                    </Button>

                    <Link href="/dashboard">
                        <Button variant="outline" fullWidth>
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>

                <p className="text-sm text-gray-400">
                    Didn't receive the email? Check your spam folder or try resending.
                </p>
            </div>
        </AuthLayout>
    )
}
