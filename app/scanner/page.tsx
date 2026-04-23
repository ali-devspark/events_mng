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
    const [manualCode, setManualCode] = useState('')
    const [showManualModal, setShowManualModal] = useState(false)
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
                        // Handle both "EVENT_ID:ATTENDEE_ID" and "ATTENDEE_ID"
                        const parts = decodedText.split(':')
                        const attendeeId = parts.length > 1 ? parts[1] : parts[0]
                        
                        if (!attendeeId || attendeeId.length < 10) {
                            throw new Error(t.scanner.invalidFormat)
                        }

                        const attendee = await checkInAttendee(attendeeId)
                        setAttendeeInfo(attendee)
                        setSuccess(t.scanner.checkInSuccess)
                        setTimeout(() => setLoading(false), 2000)
                    } catch (err: unknown) {
                        console.error('Scan error:', err)
                        let message = t.scanner.verifyFailed
                        
                        if (err instanceof Error) {
                            // If it's a Supabase error about "no rows", it means invalid ID or RLS block
                            if (err.message.includes('no rows')) {
                                message = isRTL ? 'تذكرة غير صالحة أو غير تابعة لهذه الفعالية' : 'Invalid ticket or not authorized for this event'
                            } else {
                                message = err.message
                            }
                        }
                        
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
    }, [loading, stopScanner, t, isRTL])

    useEffect(() => {
        return () => {
            stopScanner()
        }
    }, [stopScanner])

    const handleSwitchCamera = async () => {
        const next: CameraFacing = cameraFacing === 'environment' ? 'user' : 'environment'
        setCameraFacing(next)
        await startScanner(next)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || loading) return

        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (!html5QrcodeRef.current) {
                // We need an element to initialize, even if not visible
                html5QrcodeRef.current = new Html5Qrcode('qr-reader')
            }
            
            const decodedText = await html5QrcodeRef.current.scanFile(file, true)
            
            // Reuse the check-in logic
            const parts = decodedText.split(':')
            const attendeeId = parts.length > 1 ? parts[1] : parts[0]
            
            if (!attendeeId || attendeeId.length < 10) {
                throw new Error(t.scanner.invalidFormat)
            }

            const attendee = await checkInAttendee(attendeeId)
            setAttendeeInfo(attendee)
            setSuccess(t.scanner.checkInSuccess)
        } catch (err: unknown) {
            console.error('File scan error:', err)
            let message = isRTL ? 'فشل قراءة الرمز من الصورة' : 'Failed to read QR code from image'
            
            if (err instanceof Error) {
                if (err.message.includes('no rows')) {
                    message = isRTL ? 'تذكرة غير صالحة أو غير تابعة لهذه الفعالية' : 'Invalid ticket or not authorized for this event'
                } else if (err.message.toLocaleLowerCase().includes('no code found')) {
                    message = isRTL ? 'لم يتم العثور على رمز QR في هذه الصورة' : 'No QR code found in this image'
                } else {
                    message = err.message
                }
            }
            
            setError(message)
        } finally {
            setLoading(false)
            // Clear input
            e.target.value = ''
        }
    }

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!manualCode.trim() || loading) return

        setLoading(true)
        setError(null)
        setSuccess(null)
        
        try {
            // Handle both "EVENT_ID:ATTENDEE_ID" and "ATTENDEE_ID"
            const parts = manualCode.trim().split(':')
            const attendeeId = parts.length > 1 ? parts[1] : parts[0]

            if (!attendeeId || attendeeId.length < 10) {
                throw new Error(t.scanner.invalidFormat)
            }

            const attendee = await checkInAttendee(attendeeId)
            setAttendeeInfo(attendee)
            setSuccess(t.scanner.checkInSuccess)
            setShowManualModal(false)
            setManualCode('')
            
            // Re-start scanner after successful manual entry if it was active
            if (scannerReady) {
                await startScanner(cameraFacing)
            }
        } catch (err: unknown) {
            console.error('Manual entry error:', err)
            let message = t.scanner.verifyFailed
            
            if (err instanceof Error) {
                if (err.message.includes('no rows')) {
                    message = isRTL ? 'تذكرة غير صالحة أو غير تابعة لهذه الفعالية' : 'Invalid ticket or not authorized for this event'
                } else {
                    message = err.message
                }
            }
            
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleReset = async () => {
        setError(null)
        setSuccess(null)
        setAttendeeInfo(null)
        setLoading(false)
        setManualCode('')
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

                        {/* Camera feed placeholder or feed */}
                        {!scannerReady && !cameraError && (
                            <div className="w-full aspect-square flex flex-col items-center justify-center p-8 bg-gray-950/50">
                                <button
                                    onClick={() => startScanner(cameraFacing)}
                                    className="group relative flex flex-col items-center gap-4 transition-all duration-300 transform hover:scale-105 active:scale-95"
                                >
                                    <div className="w-24 h-24 rounded-full bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 group-hover:bg-primary-500/20 group-hover:border-primary-500/40 group-hover:text-primary-300 transition-all shadow-lg shadow-primary-500/10">
                                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-white font-bold text-lg mb-1">{isRTL ? 'فتح الكاميرا والبدء' : 'Start Camera Scanner'}</div>
                                        <div className="text-gray-500 text-xs font-medium uppercase tracking-widest">{isRTL ? 'انقر للبدء' : 'Click to authorize'}</div>
                                    </div>
                                </button>
                            </div>
                        )}

                        <div
                            id="qr-reader"
                            className={`w-full ${!scannerReady ? 'hidden' : ''}`}
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
                                {scannerReady ? (isRTL ? 'منطقة المسح نشطة' : 'Scanning Region Active') : (isRTL ? 'الماسح معطل' : 'Scanner Inactive')}
                            </p>
                            {/* Camera switch button */}
                            {scannerReady && (
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
                            )}
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

                    {/* Action Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setShowManualModal(true)}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
                        >
                            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                {isRTL ? 'إدخال يدوي' : 'Manual'}
                            </span>
                        </button>

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                disabled={loading}
                            />
                            <button
                                className="w-full flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
                            >
                                <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                    {isRTL ? 'رفع صورة' : 'Upload'}
                                </span>
                            </button>
                        </div>

                        <button
                            onClick={handleReset}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-200"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                {t.scanner.reset}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Manual Entry Modal */}
            {showManualModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-gray-900 border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl scale-in-center">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">{isRTL ? 'إدخال الكود يدوياً' : 'Manual Code Entry'}</h2>
                            <button 
                                onClick={() => setShowManualModal(false)}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ms-1">{isRTL ? 'رقم التذكرة أو الكود' : 'Ticket Number or Code'}</label>
                                <input
                                    type="text"
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    placeholder={isRTL ? 'أدخل الكود هنا...' : 'Enter code here...'}
                                    autoFocus
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={!manualCode.trim() || loading}
                                    className="w-full h-12 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-primary-500/20"
                                >
                                    {loading ? (isRTL ? 'جارٍ التحقق...' : 'Verifying...') : (isRTL ? 'تحقق من التذكرة' : 'Verify Ticket')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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
