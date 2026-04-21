'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { checkInAttendee } from '@/lib/api/events'
import Sidebar from '@/components/layout/Sidebar'
import { useLanguage } from '@/contexts/LanguageContext'
import { Attendee } from '@/types'

type CameraFacing = 'environment' | 'user'

export default function ScannerPage() {
    const { t, isRTL } = useLanguage()
    const [attendeeInfo, setAttendeeInfo] = useState<Attendee | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [cameraFacing, setCameraFacing] = useState<CameraFacing>('environment')
    const [scannerReady, setScannerReady] = useState(false)
    const [cameraError, setCameraError] = useState<string | null>(null)
    const html5QrcodeRef = useRef<Html5Qrcode | null>(null)
    const isStartingRef = useRef(false)

    const stopScanner = useCallback(async () => {
        if (html5QrcodeRef.current) {
            try {
                const state = html5QrcodeRef.current.getState()
                // state 2 = SCANNING
                if (state === 2) {
                    await html5QrcodeRef.current.stop()
                }
            } catch {
                // ignore
            }
        }
    }, [])

    const startScanner = useCallback(async (facing: CameraFacing) => {
        if (isStartingRef.current) return
        isStartingRef.current = true
        setScannerReady(false)
        setCameraError(null)

        await stopScanner()

        try {
            if (!html5QrcodeRef.current) {
                html5QrcodeRef.current = new Html5Qrcode('qr-reader', {
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                    verbose: false,
                })
            }

            await html5QrcodeRef.current.start(
                { facingMode: facing },
                {
                    fps: 10,
                    qrbox: { width: 220, height: 220 },
                    aspectRatio: 1.0,
                },
                async (decodedText) => {
                    if (loading) return
                    setLoading(true)
                    setError(null)
                    setSuccess(null)

                    try {
                        const [, attendeeId] = decodedText.split(':')
                        if (!attendeeId) throw new Error(t.scanner.invalidFormat)

                        const attendee = await checkInAttendee(attendeeId)
                        setAttendeeInfo(attendee)
                        setSuccess(t.scanner.checkInSuccess)
                        setTimeout(() => setLoading(false), 2000)
                    } catch (err: unknown) {
                        console.error('Scan error:', err)
                        const message = err instanceof Error ? err.message : t.scanner.verifyFailed
                        setError(message)
                        setLoading(false)
                    }
                },
                () => { /* quiet scan failure */ }
            )
            setScannerReady(true)
        } catch (err: unknown) {
            console.error('Camera start error:', err)
            const msg = err instanceof Error ? err.message : 'Camera not accessible'
            setCameraError(msg)
        } finally {
            isStartingRef.current = false
        }
    }, [loading, stopScanner, t])

    useEffect(() => {
        startScanner(cameraFacing)
        return () => {
            stopScanner()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSwitchCamera = async () => {
        const next: CameraFacing = cameraFacing === 'environment' ? 'user' : 'environment'
        setCameraFacing(next)
        await startScanner(next)
    }

    const handleReset = async () => {
        setError(null)
        setSuccess(null)
        setAttendeeInfo(null)
        setLoading(false)
        await startScanner(cameraFacing)
    }

    return (
        <div className={`flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`}>
            <Sidebar />

            <div className="flex-1 flex flex-col p-4 md:p-8 pb-24 md:pb-8 relative z-10">
                {/* Header */}
                <header className="mb-6">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 11v1m5-16v1m0 11v1M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{t.scanner.title}</h1>
                    </div>
                    <p className="text-gray-400 text-sm md:text-base ms-12">{t.scanner.description}</p>
                </header>

                <div className="max-w-md mx-auto w-full space-y-5">
                    {/* Scanner Card */}
                    <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
                        {/* Camera corner decorations */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            {/* Top-left */}
                            <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-primary-500/80 rounded-tl-lg" />
                            {/* Top-right */}
                            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-primary-500/80 rounded-tr-lg" />
                            {/* Bottom-left */}
                            <div className="absolute bottom-16 left-6 w-8 h-8 border-b-2 border-l-2 border-primary-500/80 rounded-bl-lg" />
                            {/* Bottom-right */}
                            <div className="absolute bottom-16 right-6 w-8 h-8 border-b-2 border-r-2 border-primary-500/80 rounded-br-lg" />
                        </div>

                        {/* Camera feed */}
                        <div
                            id="qr-reader"
                            className="w-full"
                            style={{ minHeight: '260px' }}
                        />

                        {/* Loading overlay */}
                        {loading && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20 backdrop-blur-sm">
                                <div className="text-center">
                                    <div className="w-14 h-14 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                    <p className="text-white text-sm font-medium">{t.scanner.waiting}</p>
                                </div>
                            </div>
                        )}

                        {/* Camera error overlay */}
                        {cameraError && !scannerReady && (
                            <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center z-20 p-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.867V15.13a1 1 0 01-1.447.894L15 14M3 8a2 2 0 00-2 2v4a2 2 0 002 2h8a2 2 0 002-2v-4a2 2 0 00-2-2H3z" />
                                        </svg>
                                    </div>
                                    <p className="text-red-400 text-sm">{cameraError}</p>
                                    <button
                                        onClick={() => startScanner(cameraFacing)}
                                        className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
                                    >
                                        {isRTL ? 'إعادة المحاولة' : 'Retry'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Bottom bar inside card */}
                        <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-t border-white/10">
                            <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">
                                {t.scanner.scanRegionDesc}
                            </p>
                            {/* Camera switch button */}
                            <button
                                onClick={handleSwitchCamera}
                                disabled={loading}
                                title={isRTL ? 'تبديل الكاميرا' : 'Switch Camera'}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden sm:inline">
                                    {cameraFacing === 'environment'
                                        ? (isRTL ? 'أمامي' : 'Front')
                                        : (isRTL ? 'خلفي' : 'Back')}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Active camera indicator */}
                    {scannerReady && (
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span>
                                {cameraFacing === 'environment'
                                    ? (isRTL ? 'الكاميرا الخلفية نشطة' : 'Rear camera active')
                                    : (isRTL ? 'الكاميرا الأمامية نشطة' : 'Front camera active')}
                            </span>
                        </div>
                    )}

                    {/* Results */}
                    <div className="space-y-4">
                        {success && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 animate-in fade-in slide-in-from-top-3 duration-300">
                                <div className="flex items-center gap-4 text-green-400">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base md:text-lg">{success}</h3>
                                        {attendeeInfo && (
                                            <p className="text-green-300/80 mt-1 text-sm">
                                                {attendeeInfo.name} • {attendeeInfo.company}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                                <div className="flex items-center gap-4 text-red-400">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base md:text-lg">{error}</h3>
                                        <p className="text-red-300/80 mt-1 text-sm">{t.scanner.manualEntryDesc}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!success && !error && !loading && (
                            <div className="text-center py-8 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-gray-500 font-medium animate-pulse text-sm">{t.scanner.waiting}</p>
                            </div>
                        )}
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        className="w-full h-12 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {t.scanner.reset}
                    </button>
                </div>
            </div>

            <style jsx global>{`
                #qr-reader {
                    background: #000 !important;
                    border: none !important;
                    width: 100% !important;
                }
                #qr-reader video {
                    width: 100% !important;
                    object-fit: cover !important;
                    border-radius: 0 !important;
                }
                #qr-reader__scan_region {
                    background: #000 !important;
                    min-height: 260px !important;
                }
                #qr-reader__scan_region img {
                    display: none !important;
                }
                #qr-reader__dashboard {
                    display: none !important;
                }
                #qr-reader__status_span {
                    display: none !important;
                }
            `}</style>
        </div>
    )
}
