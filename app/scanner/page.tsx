'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { checkInAttendee } from '@/lib/api/events'
import Button from '@/components/ui/Button'
import Sidebar from '@/components/layout/Sidebar'
import { useLanguage } from '@/contexts/LanguageContext'

import { Attendee } from '@/types'

export default function ScannerPage() {
    const { t, isRTL } = useLanguage()
    const [attendeeInfo, setAttendeeInfo] = useState<Attendee | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const scannerRef = useRef<Html5QrcodeScanner | null>(null)

    const onScanSuccess = useCallback(async (decodedText: string) => {
        if (loading) return
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            // Expected format: "eventId:attendeeId"
            const [, attendeeId] = decodedText.split(':')
            
            if (!attendeeId) {
                throw new Error(t.scanner.invalidFormat)
            }

            const attendee = await checkInAttendee(attendeeId)
            setAttendeeInfo(attendee)
            setSuccess(t.scanner.checkInSuccess)
            
            // Pause scanner for a moment
            setTimeout(() => setLoading(false), 2000)
        } catch (err: unknown) {
            console.error('Scan processing error:', err)
            const message = err instanceof Error ? err.message : t.scanner.verifyFailed
            setError(message)
            setLoading(false)
        }
    }, [loading, t])

    const onScanFailure = useCallback(() => {
        // quiet fail for scanning process
    }, [])

    useEffect(() => {
        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            /* verbose= */ false
        )

        scannerRef.current.render(onScanSuccess, onScanFailure)

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(error => {
                    console.error("Failed to clear scanner", error);
                });
            }
        }
    }, [onScanSuccess, onScanFailure])

    return (
        <div className={`flex min-h-screen bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
            <Sidebar />

            <div className="flex-1 flex flex-col p-4 md:p-8 relative z-10">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {t.scanner.title}
                    </h1>
                    <p className="text-gray-400">
                        {t.scanner.description}
                    </p>
                </header>

                <div className="max-w-md mx-auto w-full space-y-8">
                    {/* Scanner Box */}
                    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative p-4 backdrop-blur-xl">
                        <div id="reader" className="w-full rounded-2xl overflow-hidden"></div>
                        {loading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 backdrop-blur-sm">
                                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <div className="mt-4 text-center text-xs text-gray-500 font-medium tracking-widest uppercase">
                            {t.scanner.scanRegionDesc}
                        </div>
                    </div>

                    {/* Results / Feedback */}
                    <div className="space-y-4">
                        {success && (
                            <div className="bg-success-500/10 border border-success-500/20 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center gap-4 text-success-400">
                                    <div className="w-12 h-12 bg-success-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{success}</h3>
                                        {attendeeInfo && (
                                            <p className="text-success-300/80 mt-1">
                                                {attendeeInfo.name} • {attendeeInfo.company}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 animate-shake">
                                <div className="flex items-center gap-4 text-red-400">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{error}</h3>
                                        <p className="text-red-300/80 mt-1">
                                            {t.scanner.manualEntryDesc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
 
                        {!success && !error && !loading && (
                            <div className="text-center py-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-gray-500 font-medium animate-pulse">{t.scanner.waiting}</p>
                            </div>
                        )}
                    </div>
 
                    <div className="pt-4">
                        <Button 
                            variant="outline" 
                            fullWidth 
                            className="h-12 rounded-2xl border-white/10 hover:bg-white/5"
                            onClick={() => window.location.reload()}
                        >
                            {t.scanner.reset}
                        </Button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                #reader {
                    background: transparent !important;
                    border: none !important;
                }
                #reader__scan_region {
                    background: #000 !important;
                }
                #reader__dashboard {
                    background: rgba(255, 255, 255, 0.05) !important;
                    color: white !important;
                    padding: 20px !important;
                }
                #reader__dashboard button {
                    background: #3b82f6 !important;
                    color: white !important;
                    border: none !important;
                    padding: 8px 16px !important;
                    border-radius: 8px !important;
                    cursor: pointer !important;
                }
                #reader__status_span {
                    color: #9ca3af !important;
                }
            `}</style>
        </div>
    )
}
