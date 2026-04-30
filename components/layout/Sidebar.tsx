'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/ui/LanguageToggle'

const Sidebar: React.FC = () => {
    const pathname = usePathname()
    const router = useRouter()
    const { signOut, user } = useAuth()
    const { t, isRTL } = useLanguage()

    const handleSignOut = async () => {
        await signOut()
        router.push('/login')
    }

    const displayName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        (isRTL ? 'المستخدم' : 'User')

    const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null
    const email = user?.email || ''

    const initials = displayName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    const navigation = [
        {
            name: t.nav.dashboard,
            shortName: isRTL ? 'الرئيسية' : 'Home',
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: t.nav.events,
            shortName: isRTL ? 'الفعاليات' : 'Events',
            href: '/events',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },
        {
            name: t.nav.calendar,
            shortName: isRTL ? 'التقويم' : 'Calendar',
            href: '/calendar',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
        },

        {
            name: t.nav.settings,
            shortName: isRTL ? 'الإعدادات' : 'Settings',
            href: '/settings/account',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        },
    ]

    return (
        <>
            {/* ============================================ */}
            {/* Desktop Sidebar — hidden on mobile           */}
            {/* ============================================ */}
            <div
                className="hidden md:flex w-64 bg-gray-900 flex-col h-screen sticky top-0"
                style={{ borderInlineEndWidth: '1px', borderInlineEndColor: 'rgba(255,255,255,0.1)' }}
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                {/* Logo */}
                <div className="p-5 border-b border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-none">
                                {t.nav.systemTitle}
                            </h1>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                                {t.nav.systemDesc}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* User Profile Card */}
                <div className="p-4 border-b border-white/10">
                    <Link
                        href="/settings/profile"
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200 group"
                    >
                        <div className="relative flex-shrink-0">
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl}
                                    alt={displayName}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold text-sm">
                                    {initials}
                                </div>
                            )}
                            <div className="absolute -bottom-0.5 -end-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                            <p className="text-xs text-gray-500 truncate">{email}</p>
                        </div>

                        <svg
                            className={`w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 ${isRTL ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                                    ${isActive
                                        ? 'bg-primary-500/15 text-primary-400 font-medium border border-primary-500/20 shadow-sm shadow-primary-500/10'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                    }
                                `}
                            >
                                <span className={`flex-shrink-0 ${isActive ? 'text-primary-400' : ''}`}>
                                    {item.icon}
                                </span>
                                <span>{item.name}</span>
                                {isActive && (
                                    <span className={`${isRTL ? 'me-auto' : 'ms-auto'} w-1.5 h-1.5 rounded-full bg-primary-400`} />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Section: Language + Logout */}
                <div className="p-4 border-t border-white/10 space-y-2">
                    <div className="flex justify-center">
                        <LanguageToggle />
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200 w-full"
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t.nav.logout}
                    </button>
                </div>
            </div>

            {/* ============================================ */}
            {/* Mobile Bottom Navigation Bar                 */}
            {/* ============================================ */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-t border-white/10"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                                    flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 min-w-[56px]
                                    ${isActive
                                        ? 'text-primary-400'
                                        : 'text-gray-500 hover:text-gray-300'
                                    }
                                `}
                            >
                                {/* Icon with active background */}
                                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary-500/20' : ''}`}>
                                    {item.icon}
                                </div>
                                <span className={`text-[10px] font-medium leading-none ${isActive ? 'text-primary-400' : 'text-gray-500'}`}>
                                    {item.shortName}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}

export default Sidebar
