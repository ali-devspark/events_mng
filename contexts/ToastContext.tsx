'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLanguage } from './LanguageContext'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const [mounted, setMounted] = useState(false)
    const { isRTL } = useLanguage()

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true)
    }, [])

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 5000)
    }, [])

    const toastUI = mounted ? createPortal(
        <div 
            className={`fixed top-8 z-[100000] flex flex-col gap-3 pointer-events-none px-6 w-full md:w-96
                ${isRTL ? 'right-0 items-end' : 'left-0 items-start'}`}
            style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        pointer-events-auto w-full
                        px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border
                        flex items-center justify-between gap-3
                        ${isRTL ? 'animate-slide-in-right' : 'animate-slide-in-left'}
                        ${toast.type === 'success' ? 'bg-success-500/10 border-success-500/20 text-success-400' : ''}
                        ${toast.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
                        ${toast.type === 'info' ? 'bg-primary-500/10 border-primary-500/20 text-primary-400' : ''}
                        ${toast.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : ''}
                    `}
                >
                    <div className="flex items-center gap-3">
                        {toast.type === 'success' && (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                        {toast.type === 'error' && (
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        <p className="text-sm font-medium">{toast.message}</p>
                    </div>
                    <button 
                        onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                        className="p-1 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>,
        document.body
    ) : null

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toastUI}
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
