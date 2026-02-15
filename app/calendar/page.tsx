'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { getEventsByMonth } from '@/lib/api/events'
import { getMonthDays, getMonthName, isSameDay, formatDateForInput } from '@/lib/date-utils'
import { CalendarEvent } from '@/types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CalendarPage() {
    const router = useRouter()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([])
    const [showDayModal, setShowDayModal] = useState(false)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const days = getMonthDays(year, month)

    useEffect(() => {
        loadEvents()
    }, [year, month])

    async function loadEvents() {
        try {
            const data = await getEventsByMonth(year, month)
            setEvents(data as CalendarEvent[])
        } catch (error) {
            console.error('Error loading events:', error)
        }
    }

    function handleDayClick(date: Date) {
        const eventsForDay = events.filter(e => {
            const eventDate = new Date(e.date)
            return isSameDay(eventDate, date)
        })
        setSelectedDate(date)
        setDayEvents(eventsForDay)
        setShowDayModal(true)
    }

    function previousMonth() {
        setCurrentDate(new Date(year, month - 2, 1))
    }

    function nextMonth() {
        setCurrentDate(new Date(year, month, 1))
    }

    function getEventsForDay(date: Date) {
        return events.filter(e => {
            const eventDate = new Date(e.date)
            return isSameDay(eventDate, date)
        })
    }

    const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth()

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
                                <h1 className="text-3xl font-bold text-white mb-2">Calendar</h1>
                                <p className="text-gray-400">View and manage your events</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={previousMonth}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h2 className="text-xl font-semibold text-white min-w-[200px] text-center">
                                    {getMonthName(month)} {year}
                                </h2>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-gray-400 font-medium text-sm py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((date, index) => {
                                const dayEvents = getEventsForDay(date)
                                const isToday = isSameDay(date, new Date())
                                const inCurrentMonth = isCurrentMonth(date)

                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleDayClick(date)}
                                        className={`
                      aspect-square p-3 rounded-xl border transition-all duration-200
                      ${inCurrentMonth
                                                ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary-500/50'
                                                : 'bg-white/[0.02] border-white/5 text-gray-600'
                                            }
                      ${isToday ? 'ring-2 ring-primary-500' : ''}
                    `}
                                    >
                                        <div className="flex flex-col h-full">
                                            <span className={`text-sm font-medium mb-2 ${inCurrentMonth ? 'text-white' : 'text-gray-600'}`}>
                                                {date.getDate()}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                                    {dayEvents.slice(0, 2).map((event, i) => (
                                                        <div
                                                            key={i}
                                                            className="text-xs px-2 py-1 rounded bg-primary-500/20 text-primary-300 truncate"
                                                        >
                                                            {event.title}
                                                        </div>
                                                    ))}
                                                    {dayEvents.length > 2 && (
                                                        <div className="text-xs text-gray-400 px-2">
                                                            +{dayEvents.length - 2} more
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </main>
            </div>

            {/* Day Events Modal */}
            <Modal
                isOpen={showDayModal}
                onClose={() => setShowDayModal(false)}
                title={selectedDate ? `Events on ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Events'}
                size="lg"
            >
                <div className="space-y-4">
                    {dayEvents.length > 0 ? (
                        <>
                            {dayEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 transition-all"
                                >
                                    <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                                    <p className="text-sm text-gray-400">{event.time}</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${event.status === 'upcoming' ? 'bg-primary-500/20 text-primary-400' :
                                            event.status === 'ongoing' ? 'bg-success-500/20 text-success-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {event.status}
                                    </span>
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10">
                                <Link href={`/events/create?date=${selectedDate ? formatDateForInput(selectedDate) : ''}`}>
                                    <Button variant="primary" fullWidth>
                                        Add Event on This Day
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-400 mb-4">No events on this day</p>
                            <Link href={`/events/create?date=${selectedDate ? formatDateForInput(selectedDate) : ''}`}>
                                <Button variant="primary">
                                    Create Event
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}
