'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import { getProfile, updateProfile, upgradeSubscription } from '@/lib/api/profiles'
import { Profile, SubscriptionTier } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SettingsPage() {
    const { language, t } = useLanguage()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [name, setName] = useState('')

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getProfile()
                setProfile(data)
                if (data) setName(data.full_name || '')
            } catch (err) {
                console.error('Error loading profile:', err)
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [])

    async function handleUpdateProfile(e: React.FormEvent) {
        e.preventDefault()
        setUpdating(true)
        setError('')
        setSuccess('')
        try {
            const updated = await updateProfile({ full_name: name })
            setProfile(updated)
            setSuccess(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully')
        } catch (err) {
            console.error('Update profile error:', err)
            setError(language === 'ar' ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile')
        } finally {
            setUpdating(false)
        }
    }

    async function handleUpgrade(tier: SubscriptionTier) {
        if (!confirm(language === 'ar' ? `هل أنت متأكد من تغيير الباقة إلى ${tier}؟` : `Are you sure you want to change to ${tier} tier?`)) return
        setUpdating(true)
        setError('')
        setSuccess('')
        try {
            const updated = await upgradeSubscription(tier)
            setProfile(updated)
            setSuccess(language === 'ar' ? 'تم تحديث الباقة بنجاح' : 'Subscription updated successfully')
        } catch (err) {
            console.error('Upgrade subscription error:', err)
            setError(language === 'ar' ? 'فشل تحديث الباقة' : 'Failed to update subscription')
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    const plans = [
        {
            id: 'free',
            name: t.settings.plans.free.name,
            price: '0',
            features: t.settings.plans.free.features,
            tier: 'free' as SubscriptionTier
        },
        {
            id: 'premium',
            name: t.settings.plans.premium.name,
            price: '29',
            features: t.settings.plans.premium.features,
            tier: 'premium' as SubscriptionTier
        },
        {
            id: 'professional',
            name: t.settings.plans.professional.name,
            price: '99',
            features: t.settings.plans.professional.features,
            tier: 'professional' as SubscriptionTier
        }
    ]

    return (
        <div className="space-y-12 pb-12">
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

            {/* Profile Section */}
            <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t.settings.profile}
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                    <Input
                        label={t.settings.fullName}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.registration.fullNamePlaceholder}
                    />
                    <div className="flex items-center gap-4">
                        <Button type="submit" variant="primary" loading={updating}>
                            {t.common.save}
                        </Button>
                    </div>
                </form>
            </section>

            {/* Subscription Section */}
            <section>
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    {t.settings.plans.title}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white/5 backdrop-blur-xl border rounded-3xl p-8 flex flex-col ${profile?.subscription_tier === plan.tier
                                    ? 'border-primary-500 ring-1 ring-primary-500'
                                    : 'border-white/10'
                                }`}
                        >
                            {profile?.subscription_tier === plan.tier && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                    {t.settings.plans.currentPlan}
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">${plan.price}</span>
                                <span className="text-gray-400">/{t.settings.plans.annual}</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <svg className="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant={profile?.subscription_tier === plan.tier ? 'outline' : 'primary'}
                                fullWidth
                                disabled={profile?.subscription_tier === plan.tier || updating}
                                onClick={() => handleUpgrade(plan.tier)}
                            >
                                {profile?.subscription_tier === plan.tier
                                    ? t.settings.plans.active
                                    : t.settings.plans.choosePlan}
                            </Button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Security Section */}
            {/* <section className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 opacity-50">
                <h2 className="text-xl font-bold text-white mb-4">{t.settings.securityTitle}</h2>
                <p className="text-gray-400 mb-6">{t.settings.securityDesc}</p>
                <Button variant="outline" disabled>
                    {t.settings.changePassword}
                </Button>
            </section> */}
        </div>
    )
}
