'use client'

import React, { useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import { generateQRCodeData } from '@/lib/barcode'
import { useLanguage } from '@/contexts/LanguageContext'

interface BarcodeDisplayProps {
    event: {
        id: string
        title: string
        barcode: string
    }
    size?: number
    overrideValue?: string
}

const BarcodeDisplay: React.FC<BarcodeDisplayProps> = ({ event, size = 200, overrideValue }) => {
    const { isRTL } = useLanguage()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            const qrData = overrideValue ? overrideValue : generateQRCodeData(event)
            QRCode.toCanvas(canvasRef.current, qrData, {
                width: size,
                margin: 2,
                color: {
                    dark: '#ffffff',
                    light: '#1f2937',
                },
            })
        }
    }, [event, size, overrideValue])

    const displayValue = overrideValue ? (overrideValue.includes(':') ? overrideValue.split(':')[1] : overrideValue) : event.barcode

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-800 p-4 rounded-xl border border-white/10">
                <canvas ref={canvasRef} />
            </div>
            <div className="text-center">
                <p className="text-sm text-gray-400 mb-1">{overrideValue ? (isRTL ? 'رقم التذكرة' : 'Ticket ID') : (isRTL ? 'باركود الفعالية' : 'Event Barcode')}</p>
                <p className="text-xs font-mono text-gray-500 break-all max-w-[200px]">{displayValue}</p>
            </div>
        </div>
    )
}

export default BarcodeDisplay
