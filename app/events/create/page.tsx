'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { createEvent } from '@/lib/api/events'
import { formatDateForInput } from '@/lib/date-utils'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSubscription } from '@/hooks/useSubscription'
import { incrementSubscriptionUsage } from '@/lib/api/subscriptions'

import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToast } from '@/contexts/ToastContext'

const CountdownWarning = ({ targetDate, isRTL }: { targetDate: Date, isRTL: boolean }) => {
    const [timeLeft, setTimeLeft] = useState(() => Math.max(0, targetDate.getTime() - Date.now()));

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = Math.max(0, targetDate.getTime() - Date.now());
            setTimeLeft(newTimeLeft);
            if (newTimeLeft <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return (
        <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400">
            <div className="font-bold mb-2">
                {isRTL ? 'تنبيه: لن تتمكن من التعديل أو الحذف بعد انقضاء هذا الوقت' : 'Warning: You will not be able to edit or delete after this time'}
            </div>
            <div className="text-2xl font-mono text-center font-bold" dir="ltr">
                {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
        </div>
    );
};

export default function CreateEventPage() {
    const router = useRouter()
    const { t, isRTL } = useLanguage()
    const { showToast } = useToast()
    const { subscription, isFeatureAllowed } = useSubscription()

    const [loading, setLoading] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState(() => {
        const now = new Date();
        now.setHours(now.getHours() + 1);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return {
            title: '',
            description: '',
            date: formatDateForInput(new Date()),
            time: `${hours}:${minutes}`,
            location: '',
            max_attendees: 100,
            category: 'event_conference',
            type: 'public' as 'public' | 'private',
            is_online_registration_enabled: true,
            ticket_price: 0,
        };
    })
    const [customCategory, setCustomCategory] = useState('')

    const categories = [
        { id: 'graduation', label: t.events.categoryGraduation || 'Graduation' },
        { id: 'wedding', label: t.events.categoryWedding || 'Wedding' },
        { id: 'engagement', label: t.events.categoryEngagement || 'Engagement' },
        { id: 'event_conference', label: t.events.categoryConference || 'Event/Conference' },
        { id: 'other', label: t.events.categoryOther || 'Other' },
    ]

    const handlePreSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const eventDateTime = new Date(`${formData.date}T${formData.time}`);
        const oneHourFromNow = new Date();
        oneHourFromNow.setHours(oneHourFromNow.getHours() + 1);
        oneHourFromNow.setMinutes(oneHourFromNow.getMinutes() - 1); 

        if (eventDateTime < oneHourFromNow) {
            const msg = isRTL ? 'يجب أن يكون وقت الفعالية بعد ساعة من الآن على الأقل' : 'Event time must be at least 1 hour from now';
            setError(msg);
            showToast(msg, 'error');
            return;
        }

        if (!isFeatureAllowed('create_event')) {
            setError(t.common?.error || 'Subscription limit reached or expired')
            showToast(t.common?.error || 'Subscription limit reached', 'error')
            return
        }

        setShowConfirm(true)
    }

    const handleConfirmCreate = async () => {
        setShowConfirm(false)
        setLoading(true)

        try {
            const finalCategory = formData.category === 'other' ? customCategory : categories.find(c => c.id === formData.category)?.label || formData.category;

            const payload = {
                ...formData,
                category: finalCategory,
                is_online_registration_enabled: formData.type === 'private' ? formData.is_online_registration_enabled : true
            };

            const event = await createEvent(payload)

            if (subscription) {
                await incrementSubscriptionUsage(subscription.id)
            }

            showToast(t.events.createSuccess || 'Event created successfully!')
            router.push(`/events/${event.id}`)
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Error creating event'
            setError(msg)
            showToast(msg, 'error')
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <Sidebar />

            <div className="flex-1 relative z-10">
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20">
                    <div className="px-4 md:px-8 py-4 md:py-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-2">{t.events.create}</h1>
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            {t.events.eventCategory || 'Category'}
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            required
                                        >
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id} className="bg-gray-800 text-white">
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {formData.category === 'other' && (
                                        <Input
                                            label={t.events.categoryOtherPlaceholder || 'Specify category'}
                                            type="text"
                                            value={customCategory}
                                            onChange={(e) => setCustomCategory(e.target.value)}
                                            required
                                        />
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            {t.events.eventType || 'Event Type'}
                                        </label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className="w-4 h-4 text-primary-500 bg-white/5 border-white/10 focus:ring-primary-500"
                                                    checked={formData.type === 'public'}
                                                    onChange={() => setFormData({ ...formData, type: 'public' })}
                                                />
                                                <span className="text-white">{t.events.typePublic || 'Public'}</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    className="w-4 h-4 text-primary-500 bg-white/5 border-white/10 focus:ring-primary-500"
                                                    checked={formData.type === 'private'}
                                                    onChange={() => setFormData({ ...formData, type: 'private' })}
                                                />
                                                <span className="text-white">{t.events.typePrivate || 'Private'}</span>
                                            </label>
                                        </div>
                                    </div>

                                    {formData.type === 'private' && (
                                        <div className="flex items-center h-full pt-6">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={formData.is_online_registration_enabled}
                                                        onChange={(e) => setFormData({ ...formData, is_online_registration_enabled: e.target.checked })}
                                                    />
                                                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.is_online_registration_enabled ? 'bg-primary-500' : 'bg-gray-600'}`}></div>
                                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_online_registration_enabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                                </div>
                                                <span className="text-white">{t.events.onlineRegistration || 'Online Registration'}</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                                    <Input
                                        label={t.events.eventDate}
                                        type="date"
                                        min={new Date().toLocaleDateString('en-CA')}
                                        value={formData.date}
                                        onChange={(e) => {
                                            const newDate = e.target.value;
                                            let newTime = formData.time;
                                            const today = new Date().toLocaleDateString('en-CA');
                                            if (newDate === today) {
                                                const now = new Date();
                                                now.setHours(now.getHours() + 1);
                                                newTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                                            } else {
                                                newTime = '09:00';
                                            }
                                            setFormData({ ...formData, date: newDate, time: newTime });
                                        }}
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                                    <Input
                                        label={t.events.maxAttendeesLabel}
                                        type="number"
                                        min="1"
                                        value={formData.max_attendees || ''}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value);
                                            setFormData({ ...formData, max_attendees: isNaN(val) ? '' as unknown as number : val });
                                        }}
                                        onBlur={() => {
                                            if (!formData.max_attendees || Number(formData.max_attendees) < 1) {
                                                setFormData({ ...formData, max_attendees: 1 });
                                            }
                                        }}
                                        required
                                        helperText={t.events.maxAttendeesHelper}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                                        {t.events.createButton}
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
                onConfirm={handleConfirmCreate}
                title={t.events.confirmCreateTitle || 'Create New Event'}
                message={
                    <div>
                        {t.events.confirmCreateMessage || 'Are you sure you want to create this event?'}
                        {formData.date === new Date().toLocaleDateString('en-CA') && (
                            <CountdownWarning targetDate={new Date(`${formData.date}T${formData.time}`)} isRTL={isRTL} />
                        )}
                    </div>
                }
                confirmLabel={t.events.createButton}
                loading={loading}
            />
        </div>
    )
}
//     )
// }
