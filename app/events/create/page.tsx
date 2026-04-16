'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import { createEvent } from '@/lib/api/events'
import { formatDateForInput } from '@/lib/date-utils'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CreateEventPage() {
    const router = useRouter()
    const { t } = useLanguage()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: formatDateForInput(new Date()),
        time: '09:00',
        location: '',
        max_attendees: 100,
        required_attendees: 0,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const event = await createEvent(formData)
            router.push(`/events/${event.id}`)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : t.events.createError)
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
                    <div className="px-8 py-6">
                        <h1 className="text-3xl font-bold text-white mb-2">{t.events.create}</h1>
                        <p className="text-gray-400">{t.events.description}</p>
                    </div>
                </header>

                <main className="p-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
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

                                <div className="grid grid-cols-2 gap-6">
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

                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label={t.events.maxAttendeesLabel}
                                        type="number"
                                        min="1"
                                        value={formData.max_attendees}
                                        onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) })}
                                        required
                                        helperText={t.events.maxAttendeesHelper}
                                    />
                                    <Input
                                        label={t.events.requiredAttendeesLabel}
                                        type="number"
                                        min="0"
                                        max={formData.max_attendees}
                                        value={formData.required_attendees}
                                        onChange={(e) => setFormData({ ...formData, required_attendees: parseInt(e.target.value) })}
                                        helperText={t.events.requiredAttendeesHelper}
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" variant="primary" fullWidth loading={loading}>
                                        {loading ? t.events.creating : t.events.createButton}
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
        </div>
    )
}
//     )
// }
