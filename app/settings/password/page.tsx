'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PasswordSettingsPage() {
    const { updatePassword } = useAuth()
    const { language } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (formData.newPassword !== formData.confirmPassword) {
            setError(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
            return
        }

        if (formData.newPassword.length < 6) {
            setError(language === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل' : 'Password must be at least 6 characters')
            return
        }

        setLoading(true)

        const { error: updateError } = await updatePassword(formData.newPassword)

        if (updateError) {
            setError(updateError.message)
        } else {
            setSuccess(language === 'ar' ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully')
            setFormData({ newPassword: '', confirmPassword: '' })
        }

        setLoading(false)
    }

    return (
        <>
            <h2 className="text-lg md:text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-primary-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                </h2>

                {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form onSubmit={handleSubmit} className="space-y-5 mt-6 max-w-md">
                    <Input
                        label={language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                        type="password"
                        placeholder={language === 'ar' ? 'أدخل كلمة المرور الجديدة' : 'Enter new password'}
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        required
                        helperText={language === 'ar' ? 'يجب ألا تقل عن 6 أحرف' : 'Must be at least 6 characters'}
                    />

                    <Input
                        label={language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                        type="password"
                        placeholder={language === 'ar' ? 'قم بتأكيد كلمة المرور' : 'Confirm new password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />

                    <div className="pt-4">
                        <Button type="submit" variant="primary" loading={loading}>
                            {language === 'ar' ? 'تحديث كلمة المرور' : 'Update Password'}
                        </Button>
                    </div>
                </form>
        </>
    )
}
