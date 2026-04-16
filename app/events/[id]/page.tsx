'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import BarcodeDisplay from '@/components/events/BarcodeDisplay'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Alert from '@/components/ui/Alert'
import Modal from '@/components/ui/Modal'
import { getEventById, deleteEvent, getTicketsByEventId, createTicket, deleteTicket } from '@/lib/api/events'
import { Event, Ticket, CreateTicketInput } from '@/types'
import { formatDate, formatTime } from '@/lib/date-utils'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import Tabs from '@/components/ui/Tabs'
import { getAttendeesByEventId, checkInAttendee } from '@/lib/api/events'
import { Attendee } from '@/types'

export default function EventDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { t } = useLanguage()
    const [event, setEvent] = useState<Event | null>(null)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [attendees, setAttendees] = useState<Attendee[]>([])
    const [activeTab, setActiveTab] = useState('overview')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showTicketModal, setShowTicketModal] = useState(false)
    const [publicLink, setPublicLink] = useState('')
    const [ticketForm, setTicketForm] = useState<CreateTicketInput>({
        event_id: params.id as string,
        name: '',
        quantity: 1,
        price: 0,
    })

    const loadEventData = useCallback(async () => {
        try {
            const [eventData, ticketsData, attendeesData] = await Promise.all([
                getEventById(params.id as string),
                getTicketsByEventId(params.id as string),
                getAttendeesByEventId(params.id as string),
            ])
            setEvent(eventData)
            setTickets(ticketsData)
            setAttendees(attendeesData)
            setPublicLink(`${window.location.origin}/register/${params.id}`)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }, [params.id])

    useEffect(() => {
        loadEventData()
    }, [loadEventData])

    async function handleDeleteEvent() {
        if (!confirm(t.events.details.deleteConfirm)) return
        try {
            await deleteEvent(params.id as string)
            router.push('/events')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        }
    }

    async function handleCreateTicket(e: React.FormEvent) {
        e.preventDefault()
        try {
            await createTicket(ticketForm)
            setShowTicketModal(false)
            setTicketForm({
                event_id: params.id as string,
                name: '',
                quantity: 1,
                price: 0,
            })
            loadEventData()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        }
    }

    async function handleDeleteTicket(ticketId: string) {
        if (!confirm(t.events.details.deleteTicketConfirm)) return
        try {
            await deleteTicket(ticketId)
            loadEventData()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        }
    }

    async function handleCheckIn(attendeeId: string) {
        try {
            await checkInAttendee(attendeeId)
            loadEventData()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        }
    }

    const copyPublicLink = () => {
        navigator.clipboard.writeText(publicLink)
        alert(t.events.details.copied)
    }

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">{t.loading.eventModule}</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-red-400">{t.events.details.noEvent}</p>
                    </div>
                </div>
            </div>
        )
    }

    const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)

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
                        <div className="flex items-start justify-between">
                            <div>
                                <Link href="/events" className="text-sm text-primary-400 hover:text-primary-300 mb-2 inline-block">
                                    {t.events.title}/ 
                                </Link>
                                <div className="text-sm text-primary-400 hover:text-primary-300 mb-2 inline-block">
                                    {t.events.details.title}
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                                <p className="text-gray-400">{event.description}</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" onClick={copyPublicLink}>
                                    <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                    </svg>
                                    {t.events.details.registrationLink}
                                </Button>
                                <Link href="/scanner">
                                    <Button variant="outline">
                                        <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 11v1m5-16v1m0 11v1M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z" />
                                        </svg>
                                        {t.events.details.scanTickets}
                                    </Button>
                                </Link>
                                <Button variant="outline" onClick={handleDeleteEvent} className="text-red-400 border-red-400/30 hover:bg-red-400/10">
                                    {t.events.details.delete}
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 space-y-6">
                    {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                    <div className="mb-6">
                        <Tabs
                            tabs={[
                                { id: 'overview', label: t.events.details.overview },
                                { id: 'tickets', label: t.events.details.categories },
                                { id: 'attendees', label: t.events.details.attendees },
                            ]}
                            activeTab={activeTab}
                            onChange={setActiveTab}
                        />
                    </div>

                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Stats */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <p className="text-gray-400 text-sm mb-1">{t.events.details.totalAttendees}</p>
                                    <p className="text-3xl font-bold text-white">{attendees.length}</p>
                                    <p className="text-sm text-gray-500 mt-2">Max: {event.max_attendees}</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <p className="text-gray-400 text-sm mb-1">{t.events.details.checkedIn}</p>
                                    <p className="text-3xl font-bold text-success-400">{attendees.filter(a => a.checked_in).length}</p>
                                    <p className="text-sm text-gray-500 mt-2">{((attendees.filter(a => a.checked_in).length / (attendees.length || 1)) * 100).toFixed(0)}% attendance</p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                    <p className="text-gray-400 text-sm mb-1">{t.events.details.ticketsSold}</p>
                                    <p className="text-3xl font-bold text-primary-400">{tickets.reduce((sum, ticket) => sum + ticket.sold, 0)}</p>
                                    <p className="text-sm text-gray-500 mt-2">{tickets.length} categories</p>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                                    <h2 className="text-xl font-bold text-white mb-4">{t.events.details.title}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">{t.events.details.date}</p>
                                                <p className="text-white font-medium">{formatDate(event.date)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">{t.events.details.time}</p>
                                                <p className="text-white font-medium">{formatTime(event.time)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">{t.events.details.location}</p>
                                                <p className="text-white font-medium">{event.location}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-xs">{t.events.details.status}</p>
                                                <p className="text-white font-medium capitalize">{event.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Barcode */}
                            <div className="lg:col-span-1">
                                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center">
                                    <h2 className="text-lg font-bold text-white mb-6">{t.events.details.eventQRCode}</h2>
                                    <div className="bg-white p-4 rounded-xl inline-block mb-4">
                                        <BarcodeDisplay event={event} size={200} />
                                    </div>
                                    <p className="text-xs text-gray-500">{t.events.details.qrCodePublicDesc}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tickets' && (
                        <div className="space-y-6">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{t.events.details.tickets}</h2>
                                        <p className="text-sm text-gray-400">
                                            {totalTickets} / {event.max_attendees} {t.events.details.totalSeats}
                                        </p>
                                    </div>
                                    <Button variant="primary" onClick={() => setShowTicketModal(true)}>
                                        {t.events.details.createTicket}
                                    </Button>
                                </div>

                                {tickets.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tickets.map((ticket) => (
                                            <div key={ticket.id} className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center justify-between group hover:border-primary-500/50 transition-all">
                                                <div className="flex-1">
                                                    <h3 className="text-white font-bold text-lg">{ticket.name}</h3>
                                                    <div className="mt-4 flex items-center gap-4">
                                                        <div className="bg-primary-500/10 rounded px-2 py-1 text-xs text-primary-400">
                                                            {ticket.sold} / {ticket.quantity} {t.events.details.sold}
                                                        </div>
                                                        <div className="text-white font-bold">
                                                            {ticket.price === 0 ? t.events.details.free : `$${ticket.price.toFixed(2)}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteTicket(ticket.id)}
                                                    className="text-gray-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white/[0.02] rounded-xl border border-dashed border-white/10">
                                        <p className="text-gray-400">{t.events.details.noTickets}</p>
                                        <Button variant="outline" onClick={() => setShowTicketModal(true)} className="mt-4">
                                            {t.events.details.createTicket}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'attendees' && (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">{t.events.details.attendeeList}</h2>
                                <p className="text-sm text-gray-400">{attendees.length} {t.events.details.registered}</p>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left rtl:text-right">
                                    <thead className="bg-white/5 text-gray-400 text-sm">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">{t.events.details.name}</th>
                                            <th className="px-6 py-4 font-medium">{t.events.details.company}</th>
                                            <th className="px-6 py-4 font-medium">{t.events.details.phone}</th>
                                            <th className="px-6 py-4 font-medium">{t.events.details.status}</th>
                                            <th className="px-6 py-4 font-medium">{t.events.details.action}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {attendees.map((attendee) => (
                                            <tr key={attendee.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-medium">{attendee.name}</div>
                                                    <div className="text-gray-500 text-xs">{attendee.email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-300">{attendee.company || '-'}</td>
                                                <td className="px-6 py-4 text-gray-300">{attendee.phone || '-'}</td>
                                                <td className="px-6 py-4">
                                                    {attendee.checked_in ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-500/10 text-success-400">
                                                            {t.events.details.checkedIn}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400">
                                                            {t.events.details.pending}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {!attendee.checked_in && (
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => handleCheckIn(attendee.id)}
                                                        >
                                                            {t.events.details.checkIn}
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {attendees.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    {t.events.details.noAttendees}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Add Ticket Modal */}
            <Modal
                isOpen={showTicketModal}
                onClose={() => setShowTicketModal(false)}
                title={t.events.details.addTicket}
            >
                <form onSubmit={handleCreateTicket} className="space-y-4">
                    <Input
                        label={t.events.details.ticketName}
                        type="text"
                        placeholder="e.g., VIP Pass"
                        value={ticketForm.name}
                        onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                        required
                    />


                    <Input
                        label={t.events.details.ticketQuantity}
                        type="number"
                        min="1"
                        max={event.max_attendees - totalTickets}
                        value={ticketForm.quantity}
                        onChange={(e) => setTicketForm({ ...ticketForm, quantity: parseInt(e.target.value) })}
                        required
                        helperText={`Available: ${event.max_attendees - totalTickets}`}
                    />

                    <Input
                        label={t.events.details.ticketPrice}
                        type="number"
                        min="0"
                        step="0.01"
                        value={ticketForm.price}
                        onChange={(e) => setTicketForm({ ...ticketForm, price: parseFloat(e.target.value) })}
                        required
                    />

                    <Button type="submit" variant="primary" fullWidth>
                        {t.events.details.createTicket}
                    </Button>
                </form>
            </Modal>
        </div>
    )
}
