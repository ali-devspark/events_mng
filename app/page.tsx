'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

export default function HomePage() {
    const { t, isRTL } = useLanguage()
    const { user } = useAuth()

    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            ),
            title: t.landing.feature1Title,
            desc: t.landing.feature1Desc,
            gradient: 'from-primary-500 to-blue-500',
            bg: 'bg-primary-500/10',
            border: 'border-primary-500/20',
            textColor: 'text-primary-400',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: t.landing.feature2Title,
            desc: t.landing.feature2Desc,
            gradient: 'from-accent-500 to-purple-500',
            bg: 'bg-accent-500/10',
            border: 'border-accent-500/20',
            textColor: 'text-accent-400',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: t.landing.feature3Title,
            desc: t.landing.feature3Desc,
            gradient: 'from-green-500 to-emerald-500',
            bg: 'bg-green-500/10',
            border: 'border-green-500/20',
            textColor: 'text-green-400',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: t.landing.feature4Title,
            desc: t.landing.feature4Desc,
            gradient: 'from-orange-500 to-red-500',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20',
            textColor: 'text-orange-400',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
            ),
            title: t.landing.feature5Title,
            desc: t.landing.feature5Desc,
            gradient: 'from-pink-500 to-rose-500',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            textColor: 'text-pink-400',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
            ),
            title: t.landing.feature6Title,
            desc: t.landing.feature6Desc,
            gradient: 'from-cyan-500 to-teal-500',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/20',
            textColor: 'text-cyan-400',
        },
    ]

    return (
        <div className={`min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 ${isRTL ? 'font-cairo' : 'font-inter'}`} dir={isRTL ? 'rtl' : 'ltr'}>

            {/* Ambient background glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary-500/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-500/8 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Navigation Bar */}
            <header className="relative z-50 border-b border-white/5 bg-gray-950/50 backdrop-blur-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-white font-bold text-lg">
                                {isRTL ? 'نظمني ' : 'Nazemny'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <LanguageToggle />
                            {user ? (
                                <Link href="/dashboard">
                                    <Button variant="primary" size="sm">{t.nav.dashboard}</Button>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link href="/login">
                                        <Button variant="outline" size="sm">{t.landing.signIn}</Button>
                                    </Link>
                                    <Link href="/register" className="hidden sm:block">
                                        <Button variant="primary" size="sm">{t.landing.getStarted}</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-14 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
                        <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                        {t.landing.badge}
                    </div>

                    {/* Hero Title */}
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-white leading-none tracking-tight mb-8 animate-fade-in">
                        <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                            {t.landing.heroTitle}
                        </span>
                    </h1>

                    {/* Hero Subtitle */}
                    <h2 className="text-2xl sm:text-3xl font-semibold text-gray-200 my-6 animate-fade-in">
                        {t.landing.heroSubtitle}
                    </h2>

                    {/* Hero Description */}
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
                        {t.landing.heroDescription}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
                        <Link href="/register">
                            <Button variant="primary" size="lg" className="shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 transition-all">
                                <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                {t.landing.getStarted}
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg">
                                {t.landing.signIn}
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Bar */}
                    <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
                        {[
                            { value: t.landing.stat1Value, label: t.landing.stat1Label },
                            { value: t.landing.stat2Value, label: t.landing.stat2Label },
                            { value: t.landing.stat3Value, label: t.landing.stat3Label },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Hero visual: floating dashboard preview */}
                <div className="relative max-w-4xl mx-auto mt-16">
                    <div className="relative bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-black/40">
                        {/* Fake topbar */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            <div className="flex-1 mx-4 h-6 bg-white/5 rounded-md" />
                        </div>
                        {/* Fake dashboard content */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {['from-primary-500/30 to-primary-600/10', 'from-accent-500/30 to-accent-600/10', 'from-green-500/30 to-green-600/10'].map((grad, i) => (
                                <div key={i} className={`bg-gradient-to-br ${grad} border border-white/5 rounded-xl p-4`}>
                                    <div className="w-8 h-8 rounded-lg bg-white/10 mb-3" />
                                    <div className="h-3 bg-white/20 rounded w-1/2 mb-2" />
                                    <div className="h-6 bg-white/10 rounded w-3/4" />
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="h-16 bg-white/5 rounded-lg border border-white/5" />
                            ))}
                        </div>
                        {/* Glow overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent rounded-2xl pointer-events-none" />
                    </div>
                    {/* Bottom glow */}
                    <div className="absolute -bottom-10 left-1/4 right-1/4 h-20 bg-primary-500/20 blur-3xl rounded-full" />
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            {t.landing.featuresTitle}
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            {t.landing.featuresSubtitle}
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group relative bg-gray-900/50 backdrop-blur-sm border ${feature.border} rounded-2xl p-6 hover:bg-gray-900/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                            >
                                {/* Icon */}
                                <div className={`w-12 h-12 ${feature.bg} rounded-xl flex items-center justify-center mb-4 ${feature.textColor} group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                {/* Gradient top line */}
                                <div className={`absolute top-0 ${isRTL ? 'right-6' : 'left-6'} w-12 h-0.5 bg-gradient-to-r ${feature.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="relative bg-gradient-to-br from-primary-500/10 via-accent-500/10 to-primary-500/10 border border-white/10 rounded-3xl p-10 text-center overflow-hidden">
                        {/* Background glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 rounded-3xl" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />

                        <div className="relative">
                            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-500/20">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t.landing.ctaTitle}</h2>
                            <p className="text-gray-400 mb-8 text-lg">{t.landing.ctaDesc}</p>
                            <Link href="/register">
                                <Button variant="primary" size="lg" className="shadow-xl shadow-primary-500/25">
                                    {t.landing.getStarted}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/5 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-gray-400 text-sm">
                            {isRTL ? '© 2026 نظمني. جميع الحقوق محفوظة.' : '© 2026 Nazemny. All rights reserved.'}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span>{t.landing.builtWith}</span>
                        <span className="text-gray-400 font-medium">Next.js · Supabase · Tailwind</span>
                    </div>
                </div>
            </footer>
        </div>
    )
}
