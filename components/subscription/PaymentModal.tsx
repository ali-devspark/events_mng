'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import { uploadReceipt, createSubscriptionRequest } from '@/lib/api/subscriptions'
import { SubscriptionTier } from '@/types'
import Alert from '@/components/ui/Alert'
import { useToast } from '@/contexts/ToastContext'

interface PaymentModalProps {
    isOpen: boolean
    onClose: () => void
    plan: {
        tier: SubscriptionTier
        name: string
        price: number
    }
    onSuccess: () => void
}

export default function PaymentModal({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) {
    const { language } = useLanguage()
    const { showToast } = useToast()
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            showToast(language === 'ar' ? 'يرجى رفع إيصال الدفع' : 'Please upload a payment receipt', 'warning')
            return
        }

        setLoading(true)
        setError('')

        try {
            const publicUrl = await uploadReceipt(file)
            await createSubscriptionRequest(plan.tier, publicUrl)
            onSuccess()
            onClose()
        } catch (err: unknown) {
            console.error('Payment submission error:', err)
            const msg = err instanceof Error ? err.message : (language === 'ar' ? 'فشل إرسال الطلب، تأكد من حجم الملف (أقل من 2MB)' : 'Failed to submit request. Ensure file is under 2MB.')
            setError(msg)
            showToast(msg, 'error')
        } finally {
            setLoading(false)
        }
    }

    const bankDetails = {
        name: language === 'ar' ? 'مصرف الراجحي' : 'Al Rajhi Bank',
        account: '12345678901234567890',
        iban: 'SA12 3456 7890 1234 5678 9012',
        owner: language === 'ar' ? 'شركة نظمني لإدارة الفعاليات' : 'Nazemny Event Management Co.'
    }

    const walletDetails = {
        stcpay: '0500000000',
        urpay: '0500000000'
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={language === 'ar' ? `الاشتراك في ${plan.name}` : `Subscribe to ${plan.name}`}
        >
            <div className="space-y-6">
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <div className="space-y-4">
                    <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-2xl">
                        <h4 className="text-primary-400 font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            {language === 'ar' ? 'التحويل البنكي' : 'Bank Transfer'}
                        </h4>
                        <div className="text-sm space-y-1 text-gray-300">
                            <p><span className="text-gray-500">{language === 'ar' ? 'البنك:' : 'Bank:'}</span> {bankDetails.name}</p>
                            <p><span className="text-gray-500">{language === 'ar' ? 'المستفيد:' : 'Beneficiary:'}</span> {bankDetails.owner}</p>
                            <p><span className="text-gray-500">IBAN:</span> <span className="font-mono text-white tracking-wider">{bankDetails.iban}</span></p>
                        </div>
                    </div>

                    <div className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-2xl">
                        <h4 className="text-accent-400 font-bold mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            {language === 'ar' ? 'المحافظ الإلكترونية' : 'Digital Wallets'}
                        </h4>
                        <div className="text-sm space-y-1 text-gray-300">
                            <p><span className="text-gray-500">STC Pay:</span> {walletDetails.stcpay}</p>
                            <p><span className="text-gray-500">urpay:</span> {walletDetails.urpay}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-white/10">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            {language === 'ar' ? 'إرفاق إيصال الدفع (صورة أو PDF)' : 'Attach Payment Receipt (Image or PDF)'}
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="receipt-upload"
                            />
                            <label
                                htmlFor="receipt-upload"
                                className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white/5 border-2 border-white/10 border-dashed rounded-2xl hover:border-primary-500/50 hover:bg-white/10 cursor-pointer"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-400">
                                        <span className="font-semibold">
                                            {file ? file.name : (language === 'ar' ? 'اضغط لرفع الملف' : 'Click to upload')}
                                        </span>
                                    </p>
                                    <p className="text-xs text-gray-500">Max size 2MB</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            fullWidth
                            onClick={onClose}
                            disabled={loading}
                        >
                            {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            loading={loading}
                        >
                            {language === 'ar' ? 'إرسال الطلب' : 'Submit Request'}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}
