'use client'

import { useEffect, useState } from 'react'
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

export default function EventDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { t } = useLanguage()
    const [event, setEvent] = useState<Event | null>(null)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showTicketModal, setShowTicketModal] = useState(false)
    const [ticketForm, setTicketForm] = useState<CreateTicketInput>({
        event_id: params.id as string,
        name: '',
        type: 'general',
        quantity: 1,
        price: 0,
    })

    useEffect(() => {
        loadEventData()
    }, [params.id])

    async function loadEventData() {
        try {
            const [eventData, ticketsData] = await Promise.all([
                getEventById(params.id as string),
                getTicketsByEventId(params.id as string),
            ])
            setEvent(eventData)
            setTickets(ticketsData)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    async function handleDeleteEvent() {
        if (!confirm('Are you sure you want to delete this event?')) return
        try {
            await deleteEvent(params.id as string)
            router.push('/events')
        } catch (err: any) {
            setError(err.message)
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
                type: 'general',
                quantity: 1,
                price: 0,
            })
            loadEventData()
        } catch (err: any) {
            setError(err.message)
        }
    }

    async function handleDeleteTicket(ticketId: string) {
        if (!confirm('Delete this ticket type?')) return
        try {
            await deleteTicket(ticketId)
            loadEventData()
        } catch (err: any) {
            setError(err.message)
        }
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

    const totalTickets = tickets.reduce((sum, t) => sum + t.quantity, 0)

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
                                <Button variant="outline" onClick={handleDeleteEvent}>
                                    {t.events.details.delete}
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8 space-y-8">
                    {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Event Details */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4">{t.events.details.title}</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">{t.events.details.date}</p>
                                        <p className="text-white font-medium">{formatDate(event.date)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">{t.events.details.time}</p>
                                        <p className="text-white font-medium">{formatTime(event.time)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">{t.events.details.location}</p>
                                        <p className="text-white font-medium">{event.location}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">{t.events.details.status}</p>
                                        <p className="text-white font-medium capitalize">{event.status}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">{t.events.details.maxAttendees}</p>
                                        <p className="text-white font-medium">{event.max_attendees}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm mb-1">{t.events.details.requiredAttendees}</p>
                                        <p className="text-white font-medium">{event.required_attendees}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tickets */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">{t.events.details.tickets}</h2>
                                        <p className="text-sm text-gray-400">
                                            {totalTickets} / {event.max_attendees} tickets created
                                        </p>
                                    </div>
                                    <Button variant="primary" onClick={() => setShowTicketModal(true)}>
                                        {/* <PlusIcon className="w-4 h-4 mr-2" /> */}
                                        {t.events.details.createTicket}
                                    </Button>
                                </div>

                                {tickets.length > 0 ? (
                                    <div className="space-y-3">
                                        {tickets.map((ticket) => (
                                            <div key={ticket.id} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium">{ticket.name}</h3>
                                                    <p className="text-sm text-gray-400 capitalize">{ticket.type}</p>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-white font-medium">${ticket.price.toFixed(2)}</p>
                                                        <p className="text-sm text-gray-400">{ticket.sold} / {ticket.quantity} sold</p>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDeleteTicket(ticket.id)}
                                                        className="text-red-400 hover:text-red-300 p-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-400">{t.events.details.noTickets}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Barcode */}
                        <div className="lg:col-span-1">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 sticky top-24">
                                <h2 className="text-xl font-bold text-white mb-6 text-center">{t.events.details.eventQRCode}</h2>
                                <BarcodeDisplay event={event} size={250} />
                            </div>
                        </div>
                    </div>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">{t.events.details.ticketType}</label>
                        <select
                            className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            value={ticketForm.type}
                            onChange={(e) => setTicketForm({ ...ticketForm, type: e.target.value as any })}
                        >
                            <option value="free">{t.events.details.free}</option>
                            <option value="paid">{t.events.details.paid}</option>
                            <option value="vip">{t.events.details.vip}</option>
                            <option value="general">{t.events.details.general}</option>
                            <option value="early-bird">{t.events.details.earlyBird}</option>
                        </select>
                    </div>

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
                        Create Ticket Type
                    </Button>
                </form>
            </Modal>
        </div>
    )
}
