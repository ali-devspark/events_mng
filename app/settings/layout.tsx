'use client'

import Sidebar from '@/components/layout/Sidebar'
import { useLanguage } from '@/contexts/LanguageContext'

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { t } = useLanguage()

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Animated background matching other pages */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <Sidebar />

            <div className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20 flex-shrink-0">
                    <div className="px-8 py-6">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            {t.settings.title}
                        </h1>
                        <p className="text-gray-400">
                            {t.settings.description}
                        </p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}

