'use client'

import { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import { getEventsByMonth } from '@/lib/api/events'
import { getMonthDays, isSameDay, formatDateForInput } from '@/lib/date-utils'
import { CalendarEvent } from '@/types'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

export default function CalendarPage() {
    const { language, t, isRTL } = useLanguage()
    const [currentDate, setCurrentDate] = useState(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([])
    const [showDayModal, setShowDayModal] = useState(false)
    const [loading, setLoading] = useState(true)

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const days = getMonthDays(year, month)

    useEffect(() => {
        const loadEvents = async () => {
            setLoading(true)
            try {
                const data = await getEventsByMonth(year, month)
                setEvents(data as CalendarEvent[])
            } catch (error) {
                console.error('Error loading events:', error)
            } finally {
                setLoading(false)
            }
        }
        void loadEvents()
    }, [year, month])

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

            <div className="flex-1 relative z-10 flex flex-col h-screen overflow-hidden">
                <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-20 flex-shrink-0">
                    <div className="px-8 py-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{t.calendar.title}</h1>
                            <p className="text-gray-400">{t.calendar.description}</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 p-1 rounded-xl border border-white/10">
                            <button
                                onClick={previousMonth}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                            >
                                <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold text-white min-w-[180px] text-center">
                                {t.calendar.months[month - 1]} {year}
                            </h2>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                            >
                                <svg className={`w-6 h-6 ${isRTL ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                            {/* Day Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {Object.values(t.calendar.weekDays).map((day, idx) => (
                                    <div key={idx} className="text-center text-gray-500 font-bold text-sm py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {loading ? (
                                    <div className="col-span-7 py-20 flex justify-center">
                                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    days.map((date, index) => {
                                        const dayEvents = getEventsForDay(date)
                                        const isToday = isSameDay(date, new Date())
                                        const inCurrentMonth = isCurrentMonth(date)

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleDayClick(date)}
                                                className={`
                                                    min-h-[120px] p-3 rounded-2xl border transition-all duration-200 text-left flex flex-col items-start
                                                    ${inCurrentMonth
                                                        ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary-500/50'
                                                        : 'bg-white/[0.02] border-white/5 text-gray-600 opacity-20'
                                                    }
                                                    ${isToday ? 'ring-2 ring-primary-500 ring-offset-4 ring-offset-gray-900 bg-primary-500/5' : ''}
                                                `}
                                            >
                                                <span className={`text-sm font-bold mb-2 ${inCurrentMonth ? (isToday ? 'text-primary-400' : 'text-white') : 'text-gray-600'}`}>
                                                    {date.getDate()}
                                                </span>
                                                {dayEvents.length > 0 && (
                                                    <div className="w-full space-y-1">
                                                        {dayEvents.slice(0, 2).map((event, i) => (
                                                            <div
                                                                key={i}
                                                                className="text-[10px] w-full px-2 py-1 rounded bg-primary-500/20 text-primary-300 border border-primary-500/20 truncate"
                                                            >
                                                                {event.title}
                                                            </div>
                                                        ))}
                                                        {dayEvents.length > 2 && (
                                                            <div className="text-[10px] text-gray-500 px-2 italic">
                                                                + {dayEvents.length - 2} {t.calendar.more}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </button>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Day Events Modal */}
            <Modal
                isOpen={showDayModal}
                onClose={() => setShowDayModal(false)}
                title={selectedDate ? `${t.calendar.eventsOn} ${selectedDate.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` : t.calendar.title}
                size="lg"
            >
                <div className="space-y-4">
                    {dayEvents.length > 0 ? (
                        <>
                            {dayEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="block bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all group"
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-bold text-lg group-hover:text-primary-400 transition-colors">{event.title}</h3>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                            event.status === 'upcoming' ? 'bg-primary-500/20 text-primary-400' :
                                            event.status === 'ongoing' ? 'bg-success-500/20 text-success-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-gray-400 text-sm">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {event.time}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                            {event.location}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            <div className="pt-4 border-t border-white/10">
                                <Link href={`/events/create?date=${selectedDate ? formatDateForInput(selectedDate) : ''}`}>
                                    <Button variant="primary" fullWidth>
                                        {t.calendar.addEvent}
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <p className="text-gray-400 mb-6">{t.calendar.noEvents}</p>
                            <Link href={`/events/create?date=${selectedDate ? formatDateForInput(selectedDate) : ''}`}>
                                <Button variant="primary">
                                    {t.calendar.createEvent}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    )
}
