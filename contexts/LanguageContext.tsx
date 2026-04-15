'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'ar'

interface Translations {
    // Landing Page
    landing: {
        badge: string
        heroTitle: string
        heroSubtitle: string
        heroDescription: string
        getStarted: string
        signIn: string
        learnMore: string
        featuresTitle: string
        featuresSubtitle: string
        builtWith: string
        // Features
        feature1Title: string
        feature1Desc: string
        feature2Title: string
        feature2Desc: string
        feature3Title: string
        feature3Desc: string
        feature4Title: string
        feature4Desc: string
        feature5Title: string
        feature5Desc: string
        feature6Title: string
        feature6Desc: string
        // Stats
        stat1Value: string
        stat1Label: string
        stat2Value: string
        stat2Label: string
        stat3Value: string
        stat3Label: string
        // CTA Section
        ctaTitle: string
        ctaDesc: string
    }
    // Sidebar Navigation
    nav: {
        systemTitle: string
        systemDesc: string
        dashboard: string
        events: string
        calendar: string
        settings: string
        logout: string
    }
    // Loading 
    loading: {
        dashboardModule: string
        eventModule: string
        calendarModule: string
        settingsModule: string
    }
    // Common
    common: {
        save: string
        cancel: string
        delete: string
        edit: string
        add: string
        search: string
        loading: string
        error: string
        success: string
        confirm: string
        back: string
        next: string
        close: string
    }
    // Auth
    auth: {
        email: string
        password: string
        confirmPassword: string
        fullName: string
        phone: string
        signIn: string
        signUp: string
        signOut: string
        forgotPassword: string
        resetPassword: string
        verifyEmail: string
        sendCode: string
        verifyCode: string
        noAccount: string
        hasAccount: string
        createAccount: string
    }
    // Dashboard
    dashboard: {
        title: string
        welcome: string
        totalEvents: string
        upcomingEvents: string
        finishedEvents: string
        totalAttendees: string
        recentEvents: string
        quickActions: string
        createEvent: string
        viewAll: string
        openCalendar: string
    }
    // Events
    events: {
        title: string
        create: string
        edit: string
        delete: string
        name: string
        description: string
        totalEvents: string
        upcomingEvents: string
        finishedEvents: string
        date: string
        location: string
        capacity: string
        status: string
        attendees: string
        tickets: string
        noEvents: string
        createFirstEventDesc: string
        details: {
            title: string
            eventDetails: string
            noEvent: string
            delete: string
            tickets: string
            attendees: string
            createTicket: string
            date: string
            time: string
            location: string
            status: string
            maxAttendees: string
            requiredAttendees: string
            noTickets: string
            eventQRCode: string
            addTicket: string
            ticketName: string
            ticketType: string
            ticketQuantity: string
            ticketPrice: string
            free: string
            paid: string
            vip: string
            general: string
            earlyBird: string
        }
    }
    // Settings
    settings: {
        title: string
        profile: string
        security: string
        notifications: string
        language: string
        displayName: string
        bio: string
        avatar: string
        changePassword: string
        currentPassword: string
        newPassword: string
    }
}

const translations: Record<Language, Translations> = {
    en: {
        landing: {
            badge: 'Event Management Platform',
            heroTitle: 'Nazemny',
            heroSubtitle: 'Organize Events, Create Memories',
            heroDescription: 'A comprehensive event management platform designed for modern organizers. Plan, manage, and track your events with ease — from small gatherings to large conferences.',
            getStarted: 'Get Started Free',
            signIn: 'Sign In',
            learnMore: 'Learn More',
            featuresTitle: 'Everything You Need to Succeed',
            featuresSubtitle: 'Powerful tools designed to make event organization effortless and professional',
            builtWith: 'Powered by',
            feature1Title: 'Smart Event Management',
            feature1Desc: 'Create, schedule, and manage all your events from a single intuitive dashboard with real-time updates.',
            feature2Title: 'Attendee Tracking',
            feature2Desc: 'Track registrations, manage attendee lists, and send automated confirmations and reminders.',
            feature3Title: 'Calendar Integration',
            feature3Desc: 'Visualize all your events on an interactive calendar with drag-and-drop scheduling.',
            feature4Title: 'Secure Authentication',
            feature4Desc: 'Multi-factor authentication with email and phone verification to keep your account safe.',
            feature5Title: 'Real-time Analytics',
            feature5Desc: 'Get insights on attendance rates, ticket sales, and event performance in real-time.',
            feature6Title: 'Multi-language Support',
            feature6Desc: 'Full Arabic and English support with RTL/LTR layout switching for a global audience.',
            stat1Value: '10K+',
            stat1Label: 'Events Organized',
            stat2Value: '50K+',
            stat2Label: 'Happy Attendees',
            stat3Value: '99.9%',
            stat3Label: 'Uptime',
            ctaTitle: 'Ready to organize your next event?',
            ctaDesc: 'Join thousands of event organizers who trust Nazemny to make their events a success.',
        },
        nav: {
            systemTitle: "Nazemny",
            systemDesc: "Event Management",
            dashboard: 'Dashboard',
            events: 'Events',
            calendar: 'Calendar',
            settings: 'Settings',
            logout: 'Logout',
        },
        loading: {
            dashboardModule: 'Loading dashboard...',
            eventModule: 'Loading events...',
            calendarModule: 'Loading calendar...',
            settingsModule: 'Loading settings...',
        },
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            add: 'Add',
            search: 'Search',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            confirm: 'Confirm',
            back: 'Back',
            next: 'Next',
            close: 'Close',
        },
        auth: {
            email: 'Email Address',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            fullName: 'Full Name',
            phone: 'Phone Number',
            signIn: 'Sign In',
            signUp: 'Sign Up',
            signOut: 'Sign Out',
            forgotPassword: 'Forgot Password?',
            resetPassword: 'Reset Password',
            verifyEmail: 'Verify Email',
            sendCode: 'Send Code',
            verifyCode: 'Verify Code',
            noAccount: "Don't have an account?",
            hasAccount: 'Already have an account?',
            createAccount: 'Create Account',
        },
        dashboard: {
            title: 'Dashboard',
            welcome: 'Welcome to your event management dashboard',
            totalEvents: 'Total Events',
            upcomingEvents: 'Upcoming Events',
            finishedEvents: 'Finished Events',
            totalAttendees: 'Total Attendees',
            recentEvents: 'Recent Events',
            quickActions: 'Quick Actions',
            createEvent: 'Create Event',
            viewAll: 'View All',
            openCalendar: 'Open Calendar',
        },
        events: {
            title: 'Events',
            create: 'Create Event',
            edit: 'Edit Event',
            delete: 'Delete Event',
            name: 'Event Name',
            description: 'Manage your events and tickets',
            totalEvents: "All Events",
            upcomingEvents: "Upcoming",
            finishedEvents: "Finished",
            date: 'Date & Time',
            location: 'Location',
            capacity: 'Capacity',
            status: 'Status',
            attendees: 'Attendees',
            tickets: 'Tickets',
            noEvents: 'No events found',
            createFirstEventDesc: 'Create your first event to get started',
            details: {
                title: 'Event Details',
                eventDetails: 'Event Details',
                noEvent: 'No Event Found',
                delete: 'Delete Event',
                tickets: 'Tickets',
                attendees: 'Attendees',
                createTicket: 'Create Ticket',
                date: 'Date',
                time: 'Time',
                location: 'Location',
                status: 'Status',
                maxAttendees: 'Max Attendees',
                requiredAttendees: 'Required Attendees',
                noTickets: 'No Tickets Created Yet',
                eventQRCode: 'Event QR Code',
                addTicket: 'Add Ticket',
                ticketName: 'Ticket Name',
                ticketType: 'Ticket Type',
                ticketQuantity: 'Ticket Quantity',
                ticketPrice: 'Ticket Price',
                free: 'Free',
                paid: 'Paid',
                vip: 'VIP',
                general: 'General',
                earlyBird: 'Early Bird',
            }
        },
        settings: {
            title: 'Settings Aloosh',
            profile: 'Profile',
            security: 'Security',
            notifications: 'Notifications',
            language: 'Language',
            displayName: 'Display Name',
            bio: 'Bio',
            avatar: 'Profile Photo',
            changePassword: 'Change Password',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
        },
    },
    ar: {
        landing: {
            badge: 'منصة إدارة الفعاليات',
            heroTitle: 'نظمني',
            heroSubtitle: 'نظّم فعالياتك، اصنع ذكرياتك',
            heroDescription: 'منصة متكاملة لإدارة الفعاليات مصممة للمنظمين العصريين. خطط وادر وتتبع فعالياتك بكل سهولة — من التجمعات الصغيرة إلى المؤتمرات الكبرى.',
            getStarted: 'ابدأ مجاناً',
            signIn: 'تسجيل الدخول',
            learnMore: 'اعرف أكثر',
            featuresTitle: 'كل ما تحتاجه للنجاح',
            featuresSubtitle: 'أدوات قوية مصممة لجعل تنظيم الفعاليات سهلاً ومحترفاً',
            builtWith: 'مدعوم بـ',
            feature1Title: 'إدارة ذكية للفعاليات',
            feature1Desc: 'أنشئ وجدول وادر جميع فعالياتك من لوحة تحكم واحدة سهلة الاستخدام مع تحديثات فورية.',
            feature2Title: 'تتبع الحضور',
            feature2Desc: 'تابع التسجيلات وادر قوائم الحضور وأرسل تأكيدات وتذكيرات تلقائية.',
            feature3Title: 'تكامل التقويم',
            // feature3Desc: 'اعرض جميع فعالياتك على تقويم تفاعلي مع جدولة بالسحب والإفلات.',
            feature3Desc: 'اعرض جميع فعالياتك على تقويم تفاعلي.',
            feature4Title: 'مصادقة آمنة',
            feature4Desc: 'مصادقة متعددة العوامل بالبريد الإلكتروني والهاتف لحماية حسابك.',
            feature5Title: 'تحليلات فورية',
            feature5Desc: 'احصل على رؤى حول معدلات الحضور ومبيعات التذاكر وأداء الفعاليات في الوقت الفعلي.',
            feature6Title: 'دعم متعدد اللغات',
            feature6Desc: 'دعم كامل للعربية والإنجليزية مع تبديل تخطيط RTL/LTR لجمهور عالمي.',
            stat1Value: '+10K',
            stat1Label: 'فعالية منظمة',
            stat2Value: '+50K',
            stat2Label: 'حاضر سعيد',
            stat3Value: '99.9%',
            stat3Label: 'وقت التشغيل',
            ctaTitle: 'مستعد لتنظيم فعاليتك القادمة؟',
            ctaDesc: 'انضم إلى آلاف منظمي الفعاليات الذين يثقون بنظمني لجعل فعالياتهم ناجحة.',
        },
        nav: {
            systemTitle: "نظمني",
            systemDesc: "إدارة الفعاليات",
            dashboard: 'لوحة التحكم',
            events: 'الفعاليات',
            calendar: 'التقويم',
            settings: 'الإعدادات',
            logout: 'تسجيل الخروج',
        },
        loading: {
            dashboardModule: 'جارٍ تحميل لوحة التحكم ...',
            eventModule: 'جارٍ تحميل الفعاليات ...',
            calendarModule: 'جارٍ تحميل التقويم ...',
            settingsModule: 'جارٍ تحميل الإعدادات ...',
        },
        common: {
            save: 'حفظ',
            cancel: 'إلغاء',
            delete: 'حذف',
            edit: 'تعديل',
            add: 'إضافة',
            search: 'بحث',
            loading: 'جارٍ التحميل...',
            error: 'خطأ',
            success: 'نجاح',
            confirm: 'تأكيد',
            back: 'رجوع',
            next: 'التالي',
            close: 'إغلاق',
        },
        auth: {
            email: 'البريد الإلكتروني',
            password: 'كلمة المرور',
            confirmPassword: 'تأكيد كلمة المرور',
            fullName: 'الاسم الكامل',
            phone: 'رقم الهاتف',
            signIn: 'تسجيل الدخول',
            signUp: 'إنشاء حساب',
            signOut: 'تسجيل الخروج',
            forgotPassword: 'نسيت كلمة المرور؟',
            resetPassword: 'إعادة تعيين كلمة المرور',
            verifyEmail: 'تحقق من البريد الإلكتروني',
            sendCode: 'إرسال الرمز',
            verifyCode: 'تحقق من الرمز',
            noAccount: 'ليس لديك حساب؟',
            hasAccount: 'لديك حساب بالفعل؟',
            createAccount: 'إنشاء حساب',
        },
        dashboard: {
            title: 'لوحة التحكم',
            welcome: 'مرحباً بك لوحة التحكم لإدارة فعالياتك',
            totalEvents: 'إجمالي الفعاليات',
            upcomingEvents: 'الفعاليات القادمة',
            finishedEvents: 'الفعاليات المنتهية',
            totalAttendees: 'إجمالي الحضور',
            recentEvents: 'الفعاليات الأخيرة',
            quickActions: 'الإجراءات السريعة',
            createEvent: 'إنشاء فعالية',
            viewAll: 'عرض الكل',
            openCalendar: 'فتح التقويم',
        },
        events: {
            title: 'الفعاليات',
            create: 'إنشاء فعالية',
            edit: 'تعديل الفعالية',
            delete: 'حذف الفعالية',
            name: 'اسم الفعالية',
            description: 'إدارة فعالياتك وتذاكرك',
            totalEvents: "كل الفعاليات",
            upcomingEvents: "الفعاليات القادمة",
            finishedEvents: "الفعاليات المنتهية",
            date: 'التاريخ والوقت',
            location: 'الموقع',
            capacity: 'الطاقة الاستيعابية',
            status: 'الحالة',
            attendees: 'الحضور',
            tickets: 'التذاكر',
            noEvents: 'لا توجد فعاليات',
            createFirstEventDesc: 'أنشئ أول فعالية لك للبدء',
            details: {
                title: 'تفاصيل الفعالية',
                eventDetails: 'تفاصيل الفعالية',
                noEvent: 'لا توجد فعالية',
                delete: 'حذف الفعالية',
                tickets: 'التذاكر',
                attendees: 'الحضور',
                createTicket: 'إنشاء تذكرة',
                date: 'التاريخ',
                time: 'الوقت',
                location: 'الموقع',
                status: 'الحالة',
                maxAttendees: 'أقصى عدد حضور',
                requiredAttendees: 'عدد الحضور المطلوب',
                noTickets: 'لا توجد تذاكر بعد',
                eventQRCode: 'رمز QR الخاص بالفعالية',
                addTicket: 'إضافة تذكرة',
                ticketName: 'اسم التذكرة',
                ticketType: 'نوع التذكرة',
                ticketQuantity: 'كمية التذكرة',
                ticketPrice: 'سعر التذكرة',
                free: 'مجاني',
                paid: 'مدفوع',
                vip: 'VIP',
                general: 'عام',
                earlyBird: 'مبكر',
            }
        },
        settings: {
            title: 'الإعدادات',
            profile: 'الملف الشخصي',
            security: 'الأمان',
            notifications: 'الإشعارات',
            language: 'اللغة',
            displayName: 'الاسم المعروض',
            bio: 'نبذة',
            avatar: 'صورة الملف الشخصي',
            changePassword: 'تغيير كلمة المرور',
            currentPassword: 'كلمة المرور الحالية',
            newPassword: 'كلمة المرور الجديدة',
        },
    },
}

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: Translations
    isRTL: boolean
    toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('ar')

    useEffect(() => {
        const saved = localStorage.getItem('Nazemny-language') as Language | null
        if (saved && (saved === 'en' || saved === 'ar')) {
            // Use a macrotask to avoid synchronous setState in effect
            setTimeout(() => setLanguageState(saved), 0)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('Nazemny-language', language)
        document.documentElement.lang = language
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    }, [language])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
    }

    const toggleLanguage = () => {
        setLanguageState(prev => prev === 'en' ? 'ar' : 'en')
    }

    return (
        <LanguageContext.Provider value={{
            language,
            setLanguage,
            t: translations[language],
            isRTL: language === 'ar',
            toggleLanguage,
        }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}
