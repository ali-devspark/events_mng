// Date and time utilities

export function formatDate(date: string | Date, language: 'en' | 'ar' = 'en'): string {
    const d = new Date(date)
    return d.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export function formatTime(time: string, language: 'en' | 'ar' = 'en'): string {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    
    if (language === 'ar') {
        const ampm = hour >= 12 ? 'م' : 'ص'
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    } else {
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayHour = hour % 12 || 12
        return `${displayHour}:${minutes} ${ampm}`
    }
}

export function formatDateTime(date: string, time: string, language: 'en' | 'ar' = 'en'): string {
    const connector = language === 'ar' ? ' في ' : ' at '
    return `${formatDate(date, language)}${connector}${formatTime(time, language)}`
}

export function isEventUpcoming(date: string, time: string): boolean {
    const eventDateTime = new Date(`${date}T${time}`)
    return eventDateTime > new Date()
}

export function isEventFinished(date: string, time: string): boolean {
    const eventDateTime = new Date(`${date}T${time}`)
    return eventDateTime < new Date()
}

export function getMonthDays(year: number, month: number): Date[] {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    const days: Date[] = []

    // Add days from previous month to fill the first week
    const firstDayOfWeek = firstDay.getDay()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = new Date(year, month - 1, -i)
        days.push(day)
    }

    // Add all days of the current month
    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month - 1, day))
    }

    // Add days from next month to fill the last week
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month, i))
        }
    }

    return days
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    )
}

export function formatDateForInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function formatTimeForInput(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
}

export function getMonthName(month: number): string {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    return months[month - 1]
}

export function getDayName(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[date.getDay()]
}
