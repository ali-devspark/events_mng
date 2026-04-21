'use client'

import React from 'react'
import Modal from './Modal'
import Button from './Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
    loading?: boolean
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel,
    cancelLabel,
    variant = 'primary',
    loading = false
}: ConfirmDialogProps) {
    const { t, isRTL } = useLanguage()

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
        >
            <div className={`space-y-6 ${isRTL ? 'text-start' : 'text-start'}`}>
                <p className="text-gray-400">
                    {message}
                </p>

                <div className="flex gap-3 pt-2">
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={onConfirm}
                        fullWidth
                        loading={loading}
                    >
                        {confirmLabel || t.common?.confirm || 'Confirm'}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        fullWidth
                    >
                        {cancelLabel || t.common?.cancel || 'Cancel'}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
