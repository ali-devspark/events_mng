'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { getEventById, updateEvent } from '@/lib/api/events'
import { useLanguage } from '@/contexts/LanguageContext'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/contexts/ToastContext'

export default function EditEventPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise)
    const router = useRouter()
    const { t, isRTL } = useLanguage()
    const { showToast } = useToast()
    
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        max_attendees: 0,
        category: '',
        type: 'public' as 'public' | 'private',
        is_online_registration_enabled: true,
    })

    useEffect(() => {
        async function loadEvent() {
            try {
                const event = await getEventById(params.id)
                setFormData({
                    title: event.title,
                    description: event.description || '',
                    date: event.date,
                    time: event.time,
                    location: event.location,
                    max_attendees: event.max_attendees,
                    category: event.category || '',
                    type: event.type as 'public' | 'private',
                    is_online_registration_enabled: event.is_online_registration_enabled,
                })
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Error loading event')
            } finally {
                setLoading(false)
            }
        }
        loadEvent()
    }, [params.id])

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setShowConfirm(true)
    }

    const handleConfirmUpdate = async () => {
        setShowConfirm(false)
        setUpdating(true)

        try {
            // Extract fields that shouldn't be updated
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { category: _c, type: _t, is_online_registration_enabled: _i, ...updateData } = formData
            await updateEvent(params.id, updateData)
            router.push(`/events/${params.id}`)
            setTimeout(() => {
                showToast(t.events.details.deleteSuccess.includes('حذف') ? 'تم تعديل الفعالية بنجاح' : 'Event updated successfully!')
            }, 100)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error updating event'
            setError(msg)
            showToast(msg, 'error')
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-gray-900">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            </div>
        )
    }

    return (
        <div className={`flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 ${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <Sidebar />

            <div className="flex-1 relative z-10 w-full overflow-hidden">
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
                    <div className="px-4 md:px-8 py-4 md:py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-2">{t.events.edit}</h1>
                        <p className="text-gray-400 text-sm md:text-base">{t.events.description}</p>
                    </div>
                </header>

                <main className="p-4 md:p-8 pb-28 md:pb-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 md:p-8">
                            <form onSubmit={handlePreSubmit} className="space-y-5 md:space-y-6">
                                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                                <Input
                                    label={t.events.eventTitle}
                                    type="text"
                                    placeholder={t.events.eventTitle}
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-200 mb-2">
                                        {t.events.eventDescription}
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                        rows={4}
                                        placeholder={t.events.eventDescriptionPlaceholder}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 text-start">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            {t.events.eventCategory || 'Category'}
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.category}
                                            onChange={() => {}}
                                            disabled
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            {t.events.eventType || 'Event Type'}
                                        </label>
                                        <div className="flex gap-4 pt-3 opacity-50 pointer-events-none">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className="w-4 h-4 text-primary-500 bg-white/5 border-white/10 focus:ring-primary-500"
                                                    checked={formData.type === 'public'}
                                                    readOnly
                                                />
                                                <span className="text-white">{t.events.typePublic || 'Public'}</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className="w-4 h-4 text-primary-500 bg-white/5 border-white/10 focus:ring-primary-500"
                                                    checked={formData.type === 'private'}
                                                    readOnly
                                                />
                                                <span className="text-white">{t.events.typePrivate || 'Private'}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 text-start">
                                    <Input
                                        label={t.events.eventDate}
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                    />
                                    <Input
                                        label={t.events.eventTime}
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                </div>

                                <Input
                                    label={t.events.eventLocation}
                                    type="text"
                                    placeholder={t.events.eventLocationPlaceholder}
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 text-start">
                                    <Input
                                        label={t.events.maxAttendeesLabel}
                                        type="number"
                                        min="1"
                                        value={formData.max_attendees}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setFormData({ ...formData, max_attendees: isNaN(val) ? 0 : val });
                                        }}
                                        required
                                        helperText={t.events.maxAttendeesHelper}
                                    />
                                    {formData.type === 'private' && (
                                        <div className="flex items-center h-full pt-6 opacity-50 pointer-events-none">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={formData.is_online_registration_enabled}
                                                        readOnly
                                                    />
                                                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.is_online_registration_enabled ? 'bg-primary-500' : 'bg-gray-600'}`}></div>
                                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_online_registration_enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                </div>
                                                <span className="text-white">{t.events.onlineRegistration || 'Online Registration'}</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" variant="primary" fullWidth loading={updating}>
                                        {t.common.save}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        fullWidth
                                        onClick={() => router.back()}
                                    >
                                        {t.events.cancelButton}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirmUpdate}
                title={t.events.edit}
                message={isRTL ? 'هل أنت متأكد من حفظ التعديلات على هذه الفعالية؟' : 'Are you sure you want to save changes to this event?'}
                confirmLabel={t.common.save}
                loading={updating}
            />
        </div>
    )
}
