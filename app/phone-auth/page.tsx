'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'

export default function PhoneAuthPage() {
    const router = useRouter()
    const { signInWithPhone, verifyOtp } = useAuth()
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [step, setStep] = useState<'phone' | 'otp'>('phone')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error: otpError } = await signInWithPhone(phone)

        if (otpError) {
            setError(otpError.message)
            setLoading(false)
        } else {
            setStep('otp')
            setLoading(false)
        }
    }

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error: verifyError } = await verifyOtp(phone, otp)

        if (verifyError) {
            setError(verifyError.message)
            setLoading(false)
        } else {
            router.push('/dashboard')
        }
    }

    return (
        <AuthLayout
            title="Phone Authentication"
            subtitle={step === 'phone' ? 'Enter your phone number' : 'Enter verification code'}
        >
            {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-6">
                    {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                    <Alert
                        type="info"
                        message="You'll receive an SMS with a verification code. Standard messaging rates may apply."
                    />

                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        helperText="Include country code (e.g., +1 for US)"
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Send Verification Code
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-gray-800/50 text-gray-400">Or use email</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/login">
                            <Button type="button" variant="outline" fullWidth>
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button type="button" variant="outline" fullWidth>
                                Sign Up
                            </Button>
                        </Link>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                    <Alert
                        type="success"
                        message={`Verification code sent to ${phone}`}
                    />

                    <Input
                        label="Verification Code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        maxLength={6}
                        autoComplete="one-time-code"
                    />

                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                        Verify & Continue
                    </Button>

                    <button
                        type="button"
                        onClick={() => setStep('phone')}
                        className="w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                        ← Change phone number
                    </button>

                    <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        disabled={loading}
                    >
                        Resend code
                    </button>
                </form>
            )}
        </AuthLayout>
    )
}
