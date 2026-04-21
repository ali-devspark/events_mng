'use client'

import { useEffect, useState, useCallback } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import PaymentModal from '@/components/subscription/PaymentModal'
import { useLanguage } from '@/contexts/LanguageContext'
import { getSubscriptionPlans } from '@/lib/api/plans'
import { getActiveSubscription, getPendingSubscription, simulateApproval } from '@/lib/api/subscriptions'
import { UserSubscription, SubscriptionPlan, SubscriptionTier } from '@/types'
import { useToast } from '@/contexts/ToastContext'

export default function PlanSettingsPage() {
    const { t, language } = useLanguage()
    const { showToast } = useToast()
    
    const [activeSub, setActiveSub] = useState<UserSubscription | null>(null)
    const [pendingSub, setPendingSub] = useState<UserSubscription | null>(null)
    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState('')

    const [paymentModalOpen, setPaymentModalOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<{tier: SubscriptionTier, name: string, price: number} | null>(null)

    const loadData = useCallback(async () => {
        try {
            const [plansData, activeData, pendingData] = await Promise.all([
                getSubscriptionPlans(),
                getActiveSubscription(),
                getPendingSubscription()
            ])
            setPlans(plansData)
            setActiveSub(activeData)
            setPendingSub(pendingData)
        } catch (err) {
            console.error('Error loading plans data:', err)
            setError(language === 'ar' ? 'حدث خطأ أثناء تحميل البيانات' : 'Error loading data')
        } finally {
            setLoading(false)
        }
    }, [language])

    useEffect(() => {
        loadData()
    }, [loadData])

    const handleUpgradeClick = (plan: SubscriptionPlan) => {
        setSelectedPlan({
            tier: plan.tier,
            name: language === 'ar' ? plan.name_ar : plan.name_en,
            price: plan.price
        })
        setPaymentModalOpen(true)
    }

    const handleSimulateApproval = async (subId: string) => {
        setUpdating(true)
        try {
            await simulateApproval(subId)
            showToast(language === 'ar' ? 'تم تفعيل الاشتراك بنجاح' : 'Subscription activated successfully')
            await loadData()
        } catch {
            showToast(language === 'ar' ? 'فشل التفعيل' : 'Activation failed', 'error')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <>
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <section className="space-y-8">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                {t.settings.plans.title}
                            </h2>
                            {pendingSub && (
                                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    {language === 'ar' 
                                        ? `طلب باقة ${pendingSub.tier} قيد المراجعة حالياً` 
                                        : `${pendingSub.tier} plan request is under review`}
                                    <button 
                                        onClick={() => handleSimulateApproval(pendingSub.id)}
                                        disabled={updating}
                                        className="ms-2 px-2 py-0.5 bg-yellow-500/20 hover:bg-yellow-500/30 rounded border border-yellow-500/30 transition-colors"
                                    >
                                        {language === 'ar' ? '(محاكاة الموافقة للتجربة)' : '(Simulate Approval for testing)'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
                        {plans.map((plan) => {
                            const features = language === 'ar' ? plan.features_ar : plan.features_en
                            const name = language === 'ar' ? plan.name_ar : plan.name_en
                            const isActive = activeSub?.tier === plan.tier
                            const isPending = pendingSub?.tier === plan.tier

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white/5 backdrop-blur-xl border rounded-3xl p-6 md:p-8 flex flex-col transition-all duration-300 ${
                                        isActive
                                            ? 'border-primary-500 ring-1 ring-primary-500 bg-white/10 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                                            : 'border-white/10 hover:border-white/20'
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-bold whitespace-nowrap shadow-lg">
                                            {t.settings.plans.currentPlan}
                                        </div>
                                    )}
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{name}</h3>
                                    <div className="flex items-baseline gap-1 mb-5 md:mb-6">
                                        <span className="text-3xl md:text-4xl font-bold text-white">${plan.price}</span>
                                        <span className="text-gray-400">/{t.settings.plans.annual}</span>
                                    </div>
                                    <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8 flex-1">
                                        {features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm md:text-base">
                                                <svg className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        variant={isActive ? 'outline' : 'primary'}
                                        fullWidth
                                        disabled={isActive || isPending || updating}
                                        onClick={() => handleUpgradeClick(plan)}
                                    >
                                        {isActive
                                            ? t.settings.plans.active
                                            : (isPending ? (language === 'ar' ? 'قيد المراجعة' : 'Pending Review') : t.settings.plans.choosePlan)}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {selectedPlan && (
                <PaymentModal
                    isOpen={paymentModalOpen}
                    onClose={() => {
                        setPaymentModalOpen(false)
                        setSelectedPlan(null)
                    }}
                    plan={selectedPlan}
                    onSuccess={() => {
                        showToast(language === 'ar' ? 'تم إرسال طلب الاشتراك بنجاح' : 'Subscription request sent successfully')
                        loadData()
                    }}
                />
            )}
        </>
    )
}
