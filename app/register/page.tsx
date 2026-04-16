'use client'

import { useState } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RegisterPage() {
    const { signUp } = useAuth()
    const { t, isRTL } = useLanguage()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (password !== confirmPassword) {
            setError(t.auth.register.passwordsMismatch)
            return
        }

        if (password.length < 8) {
            setError(t.auth.register.passwordMinLength)
            return
        }

        setLoading(true)

        const { error: signUpError } = await signUp(email, password)

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <AuthLayout
                title={t.auth.register.successTitle}
                subtitle={t.auth.register.successSubtitle}
            >
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                        </svg>
                    </div>
                    <Alert
                        type="success"
                        message={t.auth.register.successAlert.replace('{email}', email)}
                    />
                    <div className="pt-4">
                        <Link href="/login">
                            <Button variant="primary" fullWidth>
                                {t.auth.register.goToLogin}
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout
            title={t.auth.register.title}
            subtitle={t.auth.register.subtitle}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <Input
                    label={t.auth.login.email}
                    type="email"
                    placeholder={t.auth.login.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />

                <Input
                    label={t.auth.login.password}
                    type="password"
                    placeholder={t.auth.login.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    helperText={t.auth.register.passwordHelper}
                />

                <Input
                    label={t.auth.register.confirmPassword}
                    type="password"
                    placeholder={t.auth.register.confirmPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                />

                <Button type="submit" variant="primary" fullWidth loading={loading}>
                    {t.auth.register.createAccount}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-gray-800/50 text-gray-400">{t.auth.register.orSignUpWith}</span>
                    </div>
                </div>

                <Link href="/phone-auth">
                    <Button type="button" variant="outline" fullWidth>
                        <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        {t.auth.register.signUpPhone}
                    </Button>
                </Link>

                <p className="text-center text-gray-400 text-sm">
                    {t.auth.register.hasAccount}{' '}
                    <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                        {t.auth.register.signIn}
                    </Link>
                </p>
            </form>
        </AuthLayout>
    )
}
