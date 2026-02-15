// Barcode generation utilities for events

export function generateEventBarcode(eventId: string, title: string): string {
    // Generate a unique barcode based on event ID and timestamp
    const timestamp = Date.now()
    const titleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .substring(0, 20)

    return `EVT-${titleSlug}-${timestamp}-${eventId.substring(0, 8).toUpperCase()}`
}

export function generateQRCodeData(event: { id: string; title: string; barcode: string }): string {
    // Generate QR code data in JSON format
    return JSON.stringify({
        eventId: event.id,
        title: event.title,
        barcode: event.barcode,
        timestamp: new Date().toISOString(),
    })
}

export function validateBarcode(barcode: string): boolean {
    // Validate barcode format
    const barcodeRegex = /^EVT-[a-z0-9-]+-\d+-[A-Z0-9]{8}$/
    return barcodeRegex.test(barcode)
}
