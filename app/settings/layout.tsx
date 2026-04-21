'use client'

import Sidebar from '@/components/layout/Sidebar'
import Tabs from '@/components/ui/Tabs'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePathname } from 'next/navigation'

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { t, language } = useLanguage()
    const pathname = usePathname()

    const activeTab = pathname.split('/').pop() || 'account'

    const tabs = [
        {
            id: 'account',
            label: t.settings.account,
            href: '/settings/account',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
        },
        {
            id: 'profile',
            label: t.settings.profile,
            href: '/settings/profile',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            id: 'password',
            label: language === 'ar' ? 'كلمة المرور' : 'Password',
            href: '/settings/password',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            ),
        },
        {
            id: 'plan',
            label: t.settings.plans.title,
            href: '/settings/plan',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ]

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <Sidebar />

            <div className="flex-1 relative z-10 flex flex-col min-h-screen">
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20 flex-shrink-0">
                    <div className="px-4 md:px-8 py-4 md:py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-2">
                            {t.settings.title}
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base">
                            {t.settings.description}
                        </p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-28 md:pb-8">
                    <div className="max-w-5xl mx-auto space-y-6">
                        <Tabs tabs={tabs} activeTab={activeTab} />
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 md:p-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
