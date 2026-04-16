'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import EventCard from '@/components/events/EventCard'
import { getEvents } from '@/lib/api/events'
import { Event } from '@/types'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'finished' | 'today'>('all')
    const [loading, setLoading] = useState(true)
    const { t } = useLanguage()

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await getEvents()
                setEvents(data)
                setFilteredEvents(data)
            } catch (error) {
                console.error('Error loading events:', error)
            } finally {
                setLoading(false)
            }
        }
        loadEvents()
    }, [])

    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0]
        if (filter === 'all') {
            setFilteredEvents(events)
        } else if (filter === 'today') {
            setFilteredEvents(events.filter(e => e.date === todayStr))
        } else {
            setFilteredEvents(events.filter(e => e.status === filter))
        }
    }, [filter, events])

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
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">{t.events.title}</h1>
                                <p className="text-gray-400">{t.events.description}</p>
                            </div>
                            <Link href="/events/create">
                                <Button variant="primary">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {/* Create Event */}
                                    {t.events.create}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="p-8 space-y-6">
                    {/* Filters */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'all'
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {t.events.totalEvents}
                        </button>
                        <button
                            onClick={() => setFilter('today')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'today'
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {t.common.today}
                        </button>
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'upcoming'
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {t.events.upcomingEvents}
                        </button>
                        <button
                            onClick={() => setFilter('finished')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${filter === 'finished'
                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {t.events.finishedEvents}
                        </button>
                    </div>

                    {/* Events Grid */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-gray-400">{t.loading.eventModule}</p>
                            </div>
                        </div>
                    ) : filteredEvents.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center">
                            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="text-lg font-semibold text-white mb-2">{t.events.noEvents}</h3>
                            <p className="text-gray-400 mb-6">
                                {filter === 'all' ? t.events.createFirstEventDesc : filter === 'upcoming' ? t.events.createUpcomingDesc : t.events.createFinishedDesc}
                            </p>
                            <Link href="/events/create">
                                <Button variant="primary">{t.events.create}</Button>
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
