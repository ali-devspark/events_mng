'use client'

import React from 'react'
import Link from 'next/link'

interface Tab {
    id: string
    label: string
    href?: string
    icon?: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
    activeTab: string
    onChange?: (id: string) => void
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="border-b border-white/10">
            <nav className="flex space-x-8 rtl:space-x-reverse" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    const className = `
                        flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${isActive
                            ? 'border-primary-500 text-primary-400'
                            : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                        }
                    `

                    if (tab.href) {
                        return (
                            <Link
                                key={tab.id}
                                href={tab.href}
                                className={className}
                            >
                                {tab.icon}
                                {tab.label}
                            </Link>
                        )
                    }

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange?.(tab.id)}
                            className={className}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    )
                })}
            </nav>
        </div>
    )
}

export default Tabs
