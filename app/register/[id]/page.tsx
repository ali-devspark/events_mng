'use client'

import { useEffect, useState, use, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getEventById, createPublicAttendee } from '@/lib/api/events'
import { createClient } from '@/lib/supabase/client'
import { Event, Ticket } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useForm } from 'react-hook-form'
import { generateTicketImage } from '@/lib/utils/ticket-gen'
import Image from 'next/image'
import * as z from 'zod'

// Custom zod resolver to avoid dependency issues
const zodResolver = (schema: z.ZodSchema) => async (data: unknown) => {
    try {
        const values = schema.parse(data)
        return { values, errors: {} }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                values: {},
                errors: error.formErrors.fieldErrors,
            }
        }
        return { values: {}, errors: { root: { message: 'Validation failed' } } }
    }
}

export default function PublicRegistrationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const { t, isRTL } = useLanguage()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [ticketUrl, setTicketUrl] = useState<string | null>(null)
    const [isSoldOut, setIsSoldOut] = useState(false)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [selectedTicket, setSelectedTicket] = useState<string>('')
    const [isPrivateDisabled, setIsPrivateDisabled] = useState(false)
    const [isPublic, setIsPublic] = useState(false)



    const registrationSchema = useMemo(() => z.object({
        name: z.string().min(2, t.registration.validation.nameShort),
        email: z.string().email(t.registration.validation.emailInvalid),
        phone: z.string().min(8, t.registration.validation.phoneShort),
        company: z.string().min(2, t.registration.validation.companyRequired),
    }), [t.registration.validation])

    type RegistrationForm = z.infer<typeof registrationSchema>

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<RegistrationForm>({
        resolver: zodResolver(registrationSchema)
    })

    useEffect(() => {
        async function loadEvent() {
            try {
                const data = await getEventById(id)
                setEvent(data)

                if (data.type === 'public') {
                    setIsPublic(true)
                    return;
                }

                if (!data.is_online_registration_enabled) {
                    setIsPrivateDisabled(true)
                    return;
                }

                const eventDateTime = new Date(`${data.date}T${data.time}`)
                if (eventDateTime <= new Date()) {
                    setError('EVENT_FINISHED')
                    return;
                }

                // Fetch tickets to show ticket dropdown
                const supabase = createClient()
                const { data: eventTickets } = await supabase
                    .from('tickets')
                    .select('*')
                    .eq('event_id', id)

                const ticketsData = eventTickets!.filter((ticket: Ticket) => ticket.sold < ticket.quantity)

                if (ticketsData.length > 0) {
                    setTickets(ticketsData)
                    // Auto-select first available ticket
                    const firstAvailable = ticketsData[0]
                    if (firstAvailable) {
                        setSelectedTicket(firstAvailable.id)
                    }
                } else {
                    setIsSoldOut(true)
                }
            } catch (err: unknown) {
                console.error('Error loading event:', err)
                setError('NOT_FOUND')
            } finally {
                setLoading(false)
            }
        }
        loadEvent()
    }, [id])

    const onSubmit = async (data: RegistrationForm) => {
        if (!event) return
        setSubmitting(true)
        setError(null)
        try {
            if (event.type === 'private' && tickets.length > 0 && !selectedTicket) {
                setError(t.registration.selectTicketPrompt || 'Please select a ticket')
                setSubmitting(false)
                return
            }

            const attendee = await createPublicAttendee({
                event_id: event.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company,
                ticket_id: selectedTicket || undefined
            })

            // Generate ticket image
            const imgUrl = await generateTicketImage({
                eventName: event.title,
                attendeeName: attendee.name,
                date: event.date,
                time: event.time,
                location: event.location,
                barcode: `${event.id}:${attendee.id}` // Unique ticket code
            })
            setTicketUrl(imgUrl)
            setSuccess(true)
        } catch (err: unknown) {
            console.error('Registration error:', err)
            if (err instanceof Error && err.message === 'EVENT_SOLD_OUT') {
                setIsSoldOut(true)
                setError(t.registration.eventSoldOutError || 'Sorry, this event is sold out')
            } else {
                setError(t.common.error)
            }
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!event || error === 'NOT_FOUND') {
        return (
            <div className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        {t.registration.eventNotFound}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {t.registration.eventNotFoundDesc}
                    </p>
                    <Button onClick={() => router.push('/')} variant="primary">
                        {t.registration.goHome}
                    </Button>
                </div>
            </div>
        )
    }

    if (isPublic) {
        return (
            <div className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        {t.registration.publicEventTitle || 'Public Event'}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {t.registration.publicRegistrationDesc}
                    </p>
                    <Button onClick={() => router.push('/')} variant="primary">
                        {t.registration.goHome}
                    </Button>
                </div>
            </div>
        )
    }

    if (isPrivateDisabled) {
        return (
            <div className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        {t.registration.eventNotFound}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {(t.registration.privateRegistrationDisabled || 'This is a private event and no online registration is available.')}
                    </p>
                    <Button onClick={() => router.push('/')} variant="primary">
                        {t.registration.goHome}
                    </Button>
                </div>
            </div>
        )
    }

    if (error === 'EVENT_FINISHED') {
        return (
            <div className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        {t.registration.eventFinishedTitle || 'Event Finished'}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {t.registration.eventFinishedDesc || 'Sorry, this event has already finished and registration is closed.'}
                    </p>
                    <Button onClick={() => router.push('/')} variant="primary">
                        {t.registration.goHome}
                    </Button>
                </div>
            </div>
        )
    }

    if (isSoldOut && !success) {
        return (
            <div className={`min-h-screen bg-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
                <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">
                        {t.registration.soldOutTitle || 'Sold Out'}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {t.registration.soldOutDesc || 'Sorry, all tickets for this event are sold out or no tickets are available.'}
                    </p>
                    <Button onClick={() => router.push('/')} variant="primary">
                        {t.registration.goHome}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen bg-gray-950 text-white flex flex-col p-4 md:p-8 ${isRTL ? 'rtl font-arabic' : 'ltr'}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-2xl w-full mx-auto relative z-10 flex-1 flex flex-col justify-center">
                {!success ? (
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 md:p-12 border-b border-white/10 bg-gradient-to-br from-primary-500/10 to-transparent">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event!.title}</h1>
                            <div className="flex flex-wrap gap-4 text-gray-300">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{event!.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{event!.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{event!.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 md:p-12">
                            <h2 className="text-xl font-semibold mb-6">
                                {t.registration.title}
                            </h2>
                            {error && error !== 'NOT_FOUND' && error !== 'EVENT_FINISHED' && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <Input
                                    label={t.registration.fullName}
                                    {...register('name')}
                                    error={errors.name?.message as string}
                                    placeholder={t.registration.fullNamePlaceholder}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label={t.registration.email}
                                        type="email"
                                        {...register('email')}
                                        error={errors.email?.message as string}
                                        placeholder="example@mail.com"
                                    />
                                    <Input
                                        label={t.registration.phone}
                                        {...register('phone')}
                                        error={errors.phone?.message as string}
                                        placeholder="+966 50 000 0000"
                                    />
                                </div>
                                <Input
                                    label={t.registration.company}
                                    {...register('company')}
                                    error={errors.company?.message as string}
                                    placeholder={t.registration.companyPlaceholder}
                                />
                                
                                {event!.type === 'private' && tickets.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            {t.events.details.tickets}
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                                            value={selectedTicket}
                                            onChange={(e) => setSelectedTicket(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled className="bg-gray-800 text-gray-400">
                                                {isRTL ? 'اختر التذكرة' : 'Select a ticket'}
                                            </option>
                                            {tickets.map(ticket => {
                                                const isSoldOut = ticket.sold >= ticket.quantity;
                                                return (
                                                    <option 
                                                        key={ticket.id} 
                                                        value={ticket.id} 
                                                        disabled={isSoldOut}
                                                        className="bg-gray-800 text-white"
                                                    >
                                                        {ticket.name} - {ticket.price === 0 ? t.events.details.free : `${ticket.price}`} {isSoldOut ? `(${t.events.details.ticketSoldOut || 'Sold out'})` : ''}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                )}
 
                                <Button
                                    type="submit"
                                    variant="primary"
                                    fullWidth
                                    loading={submitting}
                                    className="h-14 text-lg font-bold mt-4"
                                >
                                    {t.registration.confirm}
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="text-center bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl animate-fade-in">
                        <div className="w-20 h-20 bg-success-500/20 text-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-4">
                            {t.registration.successTitle}
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                            {t.registration.successDesc.replace('{title}', event!.title)}
                        </p>

                        {ticketUrl && (
                            <div className="space-y-6">
                                <div className="bg-white p-4 rounded-xl inline-block shadow-lg">
                                    <Image 
                                        src={ticketUrl!} 
                                        alt="E-Ticket" 
                                        width={600} 
                                        height={300} 
                                        className="max-w-full h-auto rounded-lg" 
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-4 justify-center mt-8">
                                    <a
                                        href={ticketUrl!}
                                        download={`Ticket-${event!.title.replace(/\s+/g, '-')}.png`}
                                        className="flex-1"
                                    >
                                        <Button variant="primary" fullWidth className="h-12">
                                            <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            {t.registration.downloadImage}
                                        </Button>
                                    </a>
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 h-12"
                                        onClick={() => window.print()}
                                    >
                                        <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                        </svg>
                                        {t.registration.printTicket}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <footer className="mt-8 text-center text-gray-500 text-sm relative z-10">
                <p>&copy; {new Date().getFullYear()} Nazemny Event Management System</p>
            </footer>

            <style jsx global>{`
                @media print {
                    header, footer, .no-print, button { display: none !important; }
                    body { background: white !important; padding: 0 !important; color: black !important; }
                    .print-only { display: block !important; }
                    @page { margin: 1cm; size: portrait; }
                }
            `}</style>
        </div>
    )
}
