import QRCode from 'qrcode'

export interface TicketData {
    eventName: string
    attendeeName: string
    date: string
    time: string
    location: string
    barcode: string
}

export async function generateQRCode(data: string): Promise<string> {
    try {
        return await QRCode.toDataURL(data, {
            width: 300,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff',
            },
        })
    } catch (err) {
        console.error('QR Code generation error:', err)
        return ''
    }
}

export async function generateTicketImage(data: TicketData): Promise<string> {
    // Create a temporary canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return ''

    // Set canvas dimensions (Ticket format)
    canvas.width = 600
    canvas.height = 300

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 600, 300)
    gradient.addColorStop(0, '#111827') // gray-900
    gradient.addColorStop(1, '#1f2937') // gray-800
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 600, 300)

    // Border/Accents
    ctx.strokeStyle = '#3b82f6' // blue-500
    ctx.lineWidth = 4
    ctx.strokeRect(10, 10, 580, 280)

    // Event Name
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText(data.eventName, 30, 50)

    // Attendee Name
    ctx.fillStyle = '#9ca3af' // gray-400
    ctx.font = '16px sans-serif'
    ctx.fillText('Attendee:', 30, 90)
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 20px sans-serif'
    ctx.fillText(data.attendeeName, 30, 120)

    // Date & Time
    ctx.fillStyle = '#9ca3af'
    ctx.font = '16px sans-serif'
    ctx.fillText('Date & Time:', 30, 160)
    ctx.fillStyle = '#ffffff'
    ctx.font = '18px sans-serif'
    ctx.fillText(`${data.date} | ${data.time}`, 30, 190)

    // Location
    ctx.fillStyle = '#9ca3af'
    ctx.font = '16px sans-serif'
    ctx.fillText('Location:', 30, 230)
    ctx.fillStyle = '#ffffff'
    ctx.font = '18px sans-serif'
    ctx.fillText(data.location, 30, 260)

    // QR Code
    const qrUrl = await generateQRCode(data.barcode)
    if (qrUrl) {
        const qrImage = new Image()
        await new Promise((resolve, reject) => {
            qrImage.onload = resolve
            qrImage.onerror = () => reject(new Error('QR Load Failed'))
            qrImage.src = qrUrl
        })
        ctx.drawImage(qrImage, 350, 50, 200, 200)

        // Draw barcode text below QR
        ctx.fillStyle = '#9ca3af' // gray-400
        ctx.font = '12px Courier New, monospace'
        ctx.textAlign = 'center'
        const shortBarcode = data.barcode.length > 20 ? data.barcode.split(':').pop() || data.barcode : data.barcode
        ctx.fillText(shortBarcode, 450, 275)
        ctx.textAlign = 'start' // Reset for other draws if any
    }

    // Return the image data URL
    return canvas.toDataURL('image/png')
}
