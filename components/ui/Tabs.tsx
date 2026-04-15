'use client'

import React from 'react'
import Link from 'next/link'

interface Tab {
    id: string
    label: string
    href: string
    icon?: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
    currentTab: string
}

const Tabs: React.FC<TabsProps> = ({ tabs, currentTab }) => {
    return (
        <div className="border-b border-white/10">
            <nav className="flex space-x-8" aria-label="Tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        href={tab.href}
                        className={`
              flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${currentTab === tab.id
                                ? 'border-primary-500 text-primary-400'
                                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                            }
            `}
                    >
                        {tab.icon}
                        {tab.label}
                    </Link>
                ))}
            </nav>
        </div>
    )
}

export default Tabs
