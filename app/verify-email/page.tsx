'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/auth/AuthLayout'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'

type VerificationStatus = 'initial' | 'success' | 'already-verified' | 'expired' | 'error'

function VerifyEmailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, resendVerificationEmail, loading: authLoading } = useAuth()
    const { t } = useLanguage()
    
    const [status, setStatus] = useState<VerificationStatus>('initial')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState<'success' | 'error'>('success')

    useEffect(() => {
        const error = searchParams.get('error')
        const errorCode = searchParams.get('error_code')

        if (user?.email_confirmed_at) {
            setStatus('already-verified')
            // Delay redirect to allow user to see success message
            const timer = setTimeout(() => {
                router.push('/dashboard')
            }, 3000)
            return () => clearTimeout(timer)
        }

        if (error) {
            if (errorCode === 'otp_expired') {
                setStatus('expired')
            } else {
                setStatus('error')
                setMessage(searchParams.get('error_description') || t.auth.verifyEmail.errorSubtitle)
            }
        }
    }, [user, searchParams, router, t.auth.verifyEmail.errorSubtitle])

    const handleResend = async () => {
        setLoading(true)
        setMessage('')

        const { error } = await resendVerificationEmail()

        if (error) {
            setMessageType('error')
            setMessage(error.message)
        } else {
            setMessageType('success')
            setMessage(t.auth.register.successAlert.replace('{email}', user?.email || ''))
            setStatus('initial') // Reset to initial state after resending
        }

        setLoading(false)
    }

    const renderContent = () => {
        switch (status) {
            case 'already-verified':
            case 'success':
                return (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">
                                {status === 'success' ? t.auth.verifyEmail.successTitle : t.auth.verifyEmail.alreadyVerifiedTitle}
                            </h2>
                            <p className="text-gray-300">
                                {status === 'success' ? t.auth.verifyEmail.successSubtitle : t.auth.verifyEmail.alreadyVerifiedSubtitle}
                            </p>
                        </div>
                        <div className="pt-4">
                            <Link href="/dashboard">
                                <Button variant="primary" fullWidth>
                                    {t.auth.verifyEmail.backToDashboard}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )

            case 'expired':
                return (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 mx-auto bg-yellow-500/10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">{t.auth.verifyEmail.expiredTitle}</h2>
                            <p className="text-gray-300">{t.auth.verifyEmail.expiredSubtitle}</p>
                            <p className="text-sm text-gray-400">{t.auth.verifyEmail.noEmail}</p>
                        </div>
                        <div className="space-y-3 pt-4">
                            <Button onClick={handleResend} variant="primary" fullWidth loading={loading}>
                                {t.auth.verifyEmail.resendBtn}
                            </Button>
                            <Link href="/login">
                                <Button variant="outline" fullWidth>
                                    {t.auth.verifyEmail.tryLogin}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )

            case 'error':
                return (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 mx-auto bg-red-500/10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">{t.auth.verifyEmail.errorTitle}</h2>
                            <p className="text-gray-300">{message || t.auth.verifyEmail.errorSubtitle}</p>
                        </div>
                        <div className="space-y-3 pt-4">
                            <Button onClick={handleResend} variant="primary" fullWidth loading={loading}>
                                {t.auth.verifyEmail.resendBtn}
                            </Button>
                            <Link href="/login">
                                <Button variant="outline" fullWidth>
                                    {t.auth.verifyEmail.tryLogin}
                                </Button>
                            </Link>
                        </div>
                    </div>
                )

            default:
                return (
                    <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 mx-auto bg-primary-500/10 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                            </svg>
                        </div>

                        <div>
                            <p className="text-gray-300 mb-4">{t.auth.verifyEmail.sendingTo}</p>
                            <p className="text-white font-semibold text-xl tracking-tight">{user?.email}</p>
                        </div>

                        {message && (
                            <Alert
                                type={messageType}
                                message={message}
                                onClose={() => setMessage('')}
                            />
                        )}

                        <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-sm text-gray-300 text-left space-y-3 backdrop-blur-sm">
                            <p className="font-semibold text-white flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary-400"></span>
                                {t.auth.verifyEmail.nextSteps}
                            </p>
                            <ol className="space-y-2.5 ml-1">
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">1</span>
                                    <span>{t.auth.verifyEmail.step1}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">2</span>
                                    <span>{t.auth.verifyEmail.step2}</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white">3</span>
                                    <span>{t.auth.verifyEmail.step3}</span>
                                </li>
                            </ol>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Button
                                onClick={handleResend}
                                variant="primary"
                                fullWidth
                                loading={loading}
                            >
                                {t.auth.verifyEmail.resendBtn}
                            </Button>

                            <Link href="/dashboard">
                                <Button variant="outline" fullWidth>
                                    {t.auth.verifyEmail.backToDashboard}
                                </Button>
                            </Link>
                        </div>

                        <p className="text-sm text-gray-400">
                            {t.auth.verifyEmail.noEmail}
                        </p>
                    </div>
                )
        }
    }

    return (
        <AuthLayout
            title={status === 'initial' ? t.auth.verifyEmail.title : ''}
            subtitle={status === 'initial' ? t.auth.verifyEmail.subtitle : ''}
        >
            <div className="min-h-[400px] flex flex-col justify-center">
                {authLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    renderContent()
                )}
            </div>
        </AuthLayout>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}
