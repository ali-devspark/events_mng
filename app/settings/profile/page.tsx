'use client'

import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProfile, updateProfile } from '@/lib/api/profiles'

export default function ProfileSettingsPage() {
    const { user } = useAuth()
    const { t, language } = useLanguage()
    
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getProfile()
                if (data) setName(data.full_name || '')
            } catch (err) {
                console.error('Error loading profile:', err)
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        setError('')
        setSuccess('')
        try {
            await updateProfile({ full_name: name })
            setSuccess(language === 'ar' ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully')
        } catch (err) {
            console.error('Update profile error:', err)
            setError(language === 'ar' ? 'فشل تحديث الملف الشخصي' : 'Failed to update profile')
        } finally {
            setUpdating(false)
        }
    }

    return (
        <>
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}

            <form onSubmit={handleUpdateProfile} className="space-y-5 mt-4 md:mt-6 max-w-md">
                <Input
                    label={t.settings.fullName}
                    type="text"
                    value={loading ? '...' : name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.registration.fullNamePlaceholder}
                    disabled={loading}
                />

                <Input
                    label={language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    type="email"
                    value={user?.email || ''}
                    disabled
                    helperText={language === 'ar' ? 'لا يمكن تغيير البريد الإلكتروني' : 'Email cannot be changed'}
                />

                <div className="pt-4 flex flex-col gap-5">
                    <Button type="submit" variant="primary" loading={updating}>
                        {t.common.save}
                    </Button>
                    
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-400 mb-2">
                            {language === 'ar' ? 'تاريخ الانضمام:' : 'Account created:'} {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-gray-400 break-all">
                            {language === 'ar' ? 'معرف المستخدم:' : 'User ID:'} <span className="font-mono text-xs text-gray-500">{user?.id}</span>
                        </p>
                    </div>
                </div>
            </form>
        </>
    )
}
