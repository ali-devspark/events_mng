'use client'

import { useLanguage } from '@/contexts/LanguageContext'

export default function LanguageToggle() {
    const { language, toggleLanguage } = useLanguage()

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            title={language === 'en' ? 'Switch to Arabic' : 'التبديل للإنجليزية'}
        >
            <span className="text-base">{language === 'en' ? '🇸🇦' : '🇬🇧'}</span>
            <span>{language === 'en' ? 'عربي' : 'English'}</span>
        </button>
    )
}
