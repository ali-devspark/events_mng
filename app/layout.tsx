import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SubscriptionBanner from "@/components/layout/SubscriptionBanner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo" });

export const metadata: Metadata = {
    title: "Nazemny - نظمني | منصة إدارة الفعاليات",
    description: "منصة متكاملة لإدارة الفعاليات | Comprehensive event management platform",
};

import { ToastProvider } from "@/contexts/ToastContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ar" dir="rtl">
            <body className={`${inter.variable} ${cairo.variable} font-sans`}>
                <AuthProvider>
                    <LanguageProvider>
                        <ToastProvider>
                            <SubscriptionBanner />
                            {children}
                        </ToastProvider>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
