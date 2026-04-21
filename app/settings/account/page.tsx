'use client'

import { useEffect, useState } from 'react'
import Alert from '@/components/ui/Alert'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProfile } from '@/lib/api/profiles'
import { getActiveSubscription } from '@/lib/api/subscriptions'
import { UserSubscription } from '@/types'
import { format } from 'date-fns'
import { ar, enUS } from 'date-fns/locale'

export default function AccountSettingsPage() {
    const { language } = useLanguage()
    
    const [activeSub, setActiveSub] = useState<UserSubscription | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadData() {
            try {
                const [profileData, subData] = await Promise.all([
                    getProfile(),
                    getActiveSubscription()
                ])
                
                if (!profileData) throw new Error('Profile not found')
                setActiveSub(subData)

            } catch (err) {
                console.error('Error loading account data:', err)
                setError(language === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data')
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [language])

    const usedEvents = activeSub?.events_used || 0
    const maxEvents = activeSub?.events_limit || 0
    const unlimited = maxEvents >= 100
    const remainingEvents = unlimited ? '∞' : Math.max(0, maxEvents - usedEvents)
    const usagePercentage = unlimited ? 0 : Math.min(100, Math.round((usedEvents / maxEvents) * 100))

    const formatDate = (dateStr: string | null | undefined) => {
        if (!dateStr) return '---'
        try {
            return format(new Date(dateStr), 'PPP', { locale: language === 'ar' ? ar : enUS })
        } catch {
            return dateStr
        }
    }

    return (
        <>
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            {loading ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {language === 'ar' ? 'معلومات الحساب' : 'Account Information'}
                            </h2>
                            <p className="text-gray-400">
                                {language === 'ar' 
                                    ? 'راقب استهلاك باقتك والفعاليات المتبقية لك هذا الشهر.'
                                    : 'Monitor your plan usage and remaining events for this month.'}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                            {/* Current Plan Card */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        {language === 'ar' ? 'الباقة الحالية' : 'Current Plan'}
                                    </h3>
                                    <div className="flex items-end gap-3 mb-4">
                                        <span className="text-3xl font-bold text-primary-400 uppercase">
                                            {activeSub?.tier || '...'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-400 flex justify-between">
                                            <span>{language === 'ar' ? 'أقصى عدد للحضور بالفعالية:' : 'Max Attendees Per Event:'}</span>
                                            <span className="text-white font-medium">{activeSub?.attendees_limit || 0}</span>
                                        </p>
                                        <p className="text-sm text-gray-400 flex justify-between">
                                            <span>{language === 'ar' ? 'الفعاليات المتاحة بالباقة:' : 'Available Events in Plan:'}</span>
                                            <span className="text-white font-medium">{unlimited ? '∞' : maxEvents}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span>{language === 'ar' ? 'تاريخ انتهاء الاشتراك:' : 'Subscription Expiry:'}</span>
                                        <span className="text-gray-300 font-medium">{formatDate(activeSub?.end_date)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Usage Card */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    {language === 'ar' ? 'استهلاك الباقة الحالية' : 'Current Plan Usage'}
                                </h3>
                                
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-400">{language === 'ar' ? 'الفعاليات المستخدمة' : 'Events Used'}</span>
                                        <span className="text-white font-medium">{usedEvents} / {unlimited ? '∞' : maxEvents}</span>
                                    </div>
                                    {!unlimited && (
                                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                                            <div 
                                                className={`h-2.5 rounded-full ${usagePercentage > 90 ? 'bg-red-500' : 'bg-primary-500'}`}
                                                style={{ width: `${usagePercentage}%` }}
                                            ></div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                                    <span className="text-gray-300">
                                        {language === 'ar' ? 'الفعاليات المتبقية:' : 'Remaining Events:'}
                                    </span>
                                    <span className={`text-2xl font-bold ${remainingEvents === 0 ? 'text-red-400' : 'text-green-400'}`}>
                                        {remainingEvents}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}
