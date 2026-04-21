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
        systemTitle: string
        copyright: string
    }
    // Sidebar Navigation
    nav: {
        systemTitle: string
        systemDesc: string
        dashboard: string
        events: string
        calendar: string
        ticketScanner: string
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
        today: string
    }
    // Auth
    auth: {
        login: {
            title: string
            subtitle: string
            email: string
            emailPlaceholder: string
            password: string
            passwordPlaceholder: string
            rememberMe: string
            forgotPassword: string
            signIn: string
            orContinueWith: string
            signInPhone: string
            noAccount: string
            signUp: string
        }
        register: {
            title: string
            subtitle: string
            confirmPassword: string
            confirmPlaceholder: string
            passwordHelper: string
            createAccount: string
            orSignUpWith: string
            signUpPhone: string
            hasAccount: string
            signIn: string
            successTitle: string
            successSubtitle: string
            successAlert: string
            goToLogin: string
            passwordsMismatch: string
            passwordMinLength: string
        }
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
        eventTitle: string
        eventDescription: string
        eventDescriptionPlaceholder: string
        eventDate: string
        eventTime: string
        eventLocation: string
        eventLocationPlaceholder: string
        maxAttendeesLabel: string
        maxAttendeesHelper: string
        requiredAttendeesLabel: string
        requiredAttendeesHelper: string
        createButton: string
        cancelButton: string
        creating: string
        createSuccess: string
        createError: string
        confirmCreateTitle: string
        confirmCreateMessage: string
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
        createUpcomingDesc: string
        createFinishedDesc: string
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
            ticketQuantity: string
            ticketPrice: string
            registrationLink: string
            scanTickets: string
            overview: string
            categories: string
            totalAttendees: string
            checkedIn: string
            ticketsSold: string
            sold: string
            qrCodePublicDesc: string
            attendeeList: string
            registered: string
            name: string
            company: string
            phone: string
            action: string
            pending: string
            checkIn: string
            noAttendees: string
            totalSeats: string
            ticketCreated: string
            deleteConfirm: string
            deleteTicketConfirm: string
            copied: string
            free: string
            deleteTicketTitle: string
            deleteSuccess: string
            deleteError: string
            deleteTicketSuccess: string
            deleteTicketError: string
            ticketCreateError: string
            checkInSuccess: string
            checkInError: string
        }
    }
    // Scanner
    scanner: {
        title: string
        description: string
        invalidFormat: string
        checkInSuccess: string
        verifyFailed: string
        waiting: string
        reset: string
        manualEntryDesc: string
        scanRegionDesc: string
    }
    // Registration
    registration: {
        eventNotFound: string
        eventNotFoundDesc: string
        goHome: string
        title: string
        fullName: string
        fullNamePlaceholder: string
        email: string
        phone: string
        company: string
        companyPlaceholder: string
        confirm: string
        successTitle: string
        successDesc: string
        downloadImage: string
        printTicket: string
        validation: {
            nameShort: string
            emailInvalid: string
            phoneShort: string
            companyRequired: string
        }
    }
    // Settings
    settings: {
        title: string
        description: string
        account: string
        profile: string
        security: string
        notifications: string
        language: string
        fullName: string
        displayName: string
        bio: string
        avatar: string
        changePassword: string
        currentPassword: string
        newPassword: string
        securityTitle: string
        securityDesc: string
        plans: {
            title: string
            currentPlan: string
            active: string
            choosePlan: string
            monthly: string
            annual: string
            free: {
                name: string
                features: string[]
            }
            premium: {
                name: string
                features: string[]
            }
            professional: {
                name: string
                features: string[]
            }
        }
    }
    // Calendar
    calendar: {
        title: string
        description: string
        weekDays: {
            sun: string
            mon: string
            tue: string
            wed: string
            thu: string
            fri: string
            sat: string
        }
        more: string
        eventsOn: string
        addEvent: string
        noEvents: string
        createEvent: string
        months: string[]
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
            systemTitle: 'Nazemny',
            copyright: '© 2026 Nazemny. All rights reserved.'
        },
        nav: {
            systemTitle: "Nazemny",
            systemDesc: "Event Management",
            dashboard: 'Dashboard',
            events: 'Events',
            calendar: 'Calendar',
            ticketScanner: 'Ticket Scanner',
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
            today: 'Today',
        },
        auth: {
            login: {
                title: 'Welcome Back',
                subtitle: 'Sign in to your account to continue',
                email: 'Email Address',
                emailPlaceholder: 'you@example.com',
                password: 'Password',
                passwordPlaceholder: 'Enter your password',
                rememberMe: 'Remember me',
                forgotPassword: 'Forgot password?',
                signIn: 'Sign In',
                orContinueWith: 'Or continue with',
                signInPhone: 'Sign in with Phone',
                noAccount: "Don't have an account?",
                signUp: 'Sign up'
            },
            register: {
                title: 'Create Account',
                subtitle: 'Sign up to get started',
                confirmPassword: 'Confirm Password',
                confirmPlaceholder: 'Confirm your password',
                passwordHelper: 'Must be at least 6 characters',
                createAccount: 'Create Account',
                orSignUpWith: 'Or sign up with',
                signUpPhone: 'Sign up with Phone',
                hasAccount: 'Already have an account?',
                signIn: 'Sign in',
                successTitle: 'Check Your Email',
                successSubtitle: "We've sent you a verification link",
                successAlert: 'A verification email has been sent to {email}. Please check your inbox and click the verification link to activate your account.',
                goToLogin: 'Go to Login',
                passwordsMismatch: 'Passwords do not match',
                passwordMinLength: 'Password must be at least 8 characters'
            }
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
            eventTitle: 'Event Title',
            eventDescription: 'Description',
            eventDescriptionPlaceholder: 'Describe your event...',
            eventDate: 'Date',
            eventTime: 'Time',
            eventLocation: 'Location',
            eventLocationPlaceholder: 'e.g., Convention Center, Room 101',
            maxAttendeesLabel: 'Maximum Attendees',
            maxAttendeesHelper: 'Total capacity for this event',
            requiredAttendeesLabel: 'Required Attendees',
            requiredAttendeesHelper: 'Minimum attendees needed',
            createButton: 'Create Event',
            cancelButton: 'Cancel',
            creating: 'Creating...',
            createSuccess: 'Event created successfully!',
            createError: 'Failed to create event',
            confirmCreateTitle: 'Create New Event',
            confirmCreateMessage: 'Are you sure you want to create this event and announce it?',
            description: 'Manage your events and tickets',
            totalEvents: "All Events",
            upcomingEvents: "Upcoming Events",
            finishedEvents: "Finished Events",
            date: 'Date & Time',
            location: 'Location',
            capacity: 'Capacity',
            status: 'Status',
            attendees: 'Attendees',
            tickets: 'Tickets',
            noEvents: 'No events found',
            createFirstEventDesc: 'Create your first event to get started',
            createUpcomingDesc: 'No upcoming events',
            createFinishedDesc: 'No finished events',
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
                ticketQuantity: 'Ticket Quantity',
                ticketPrice: 'Ticket Price',
                registrationLink: 'Registration Link',
                scanTickets: 'Scan Tickets',
                overview: 'Overview',
                categories: 'Ticket Categories',
                totalAttendees: 'Total Attendees',
                checkedIn: 'Checked In',
                ticketsSold: 'Tickets Sold',
                sold: 'sold',
                qrCodePublicDesc: 'Scan this code to view public registration page',
                attendeeList: 'Attendees List',
                registered: 'registered',
                name: 'Name',
                company: 'Company',
                phone: 'Phone',
                action: 'Action',
                pending: 'Pending',
                checkIn: 'Check In',
                noAttendees: 'No attendees registered yet',
                totalSeats: 'total seats allocated',
                ticketCreated: 'Ticket Created',
                deleteConfirm: 'Are you sure you want to delete this event?',
                deleteTicketConfirm: 'Delete this ticket?',
                copied: 'Registration link copied to clipboard!',
                free: 'Free',
                deleteTicketTitle: 'Delete Ticket Category',
                deleteSuccess: 'Event deleted successfully',
                deleteError: 'Failed to delete event',
                deleteTicketSuccess: 'Ticket category deleted successfully',
                deleteTicketError: 'Failed to delete ticket category',
                ticketCreateError: 'Failed to create ticket',
                checkInSuccess: 'Checked in successfully',
                checkInError: 'Check-in failed',
            }
        },
        scanner: {
            title: 'Ticket Scanner (Gate)',
            description: 'Place the QR code inside the box to scan it',
            invalidFormat: 'Invalid QR code format',
            checkInSuccess: 'Checked in successfully!',
            verifyFailed: 'Failed to verify ticket',
            waiting: 'Waiting for scan...',
            reset: 'Reset Scanner',
            manualEntryDesc: 'Please try again or enter the code manually.',
            scanRegionDesc: 'Scanning Region',
        },
        registration: {
            eventNotFound: 'Sorry, Event Not Found',
            eventNotFoundDesc: 'The link might be invalid or registration period has ended.',
            goHome: 'Go Home',
            title: 'Event Registration',
            fullName: 'Full Name',
            fullNamePlaceholder: 'Enter your full name',
            email: 'Email Address',
            phone: 'Phone Number',
            company: 'Company / Organization',
            companyPlaceholder: 'The company you represent',
            confirm: 'Confirm Registration & Get Ticket',
            successTitle: 'Congratulations! Registration Successful',
            successDesc: 'Thank you for registering for {title}. You can now download your e-ticket to use at entry.',
            downloadImage: 'Download as Image',
            printTicket: 'Print Ticket (PDF)',
            validation: {
                nameShort: 'Name is too short',
                emailInvalid: 'Invalid email address',
                phoneShort: 'Invalid phone number',
                companyRequired: 'Company name is required'
            }
        },
        settings: {
            title: 'Settings',
            description: 'Manage your account and preferences',
            account: 'Account',
            profile: 'Profile',
            security: 'Security',
            notifications: 'Notifications',
            language: 'Language',
            fullName: 'Full Name',
            displayName: 'Display Name',
            bio: 'Bio',
            avatar: 'Profile Photo',
            changePassword: 'Change Password',
            currentPassword: 'Current Password',
            newPassword: 'New Password',
            securityTitle: 'Security',
            securityDesc: 'You can reset your password from the login page',
            plans: {
                title: 'Subscription Plans',
                currentPlan: 'Current Plan',
                active: 'Active',
                choosePlan: 'Choose Plan',
                monthly: 'mo',
                annual: 'yr',
                free: {
                    name: 'Free Plan',
                    features: [
                        'Up to 5 events/month',
                        '50 attendees per event',
                        'Email support'
                    ]
                },
                premium: {
                    name: 'Premium Plan',
                    features: [
                        'Up to 20 events/month',
                        '200 attendees per event',
                        'Priority support'
                    ]
                },
                professional: {
                    name: 'Professional Plan',
                    features: [
                        'Unlimited events/month',
                        '1000 attendees per event'
                    ]
                }
            }
        },
        calendar: {
            title: 'Calendar',
            description: 'View and manage your events',
            weekDays: {
                sun: 'Sun',
                mon: 'Mon',
                tue: 'Tue',
                wed: 'Wed',
                thu: 'Thu',
                fri: 'Fri',
                sat: 'Sat'
            },
            more: 'more',
            eventsOn: 'Events on',
            addEvent: 'Add Event on This Day',
            noEvents: 'No events on this day',
            createEvent: 'Create Event',
            months: [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ]
        }
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
            systemTitle: 'نظمني',
            copyright: '© 2026 نظمني. جميع الحقوق محفوظة.'
        },
        nav: {
            systemTitle: "نظمني",
            systemDesc: "إدارة الفعاليات",
            dashboard: 'لوحة التحكم',
            events: 'الفعاليات',
            calendar: 'التقويم',
            ticketScanner: 'ماسح التذاكر',
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
            today: 'اليوم',
        },
        auth: {
            login: {
                title: 'مرحباً بعودتك',
                subtitle: 'سجل دخولك للمتابعة',
                email: 'البريد الإلكتروني',
                emailPlaceholder: 'you@example.com',
                password: 'كلمة المرور',
                passwordPlaceholder: 'أدخل كلمة المرور',
                rememberMe: 'تذكرني',
                forgotPassword: 'نسيت كلمة المرور؟',
                signIn: 'تسجيل الدخول',
                orContinueWith: 'أو المتابعة باستخدام',
                signInPhone: 'الدخول بواسطة الهاتف',
                noAccount: 'ليس لديك حساب؟',
                signUp: 'إنشاء حساب'
            },
            register: {
                title: 'إنشاء حساب',
                subtitle: 'سجل للحصول على حساب جديد',
                confirmPassword: 'تأكيد كلمة المرور',
                confirmPlaceholder: 'أعد إدخال كلمة المرور',
                passwordHelper: 'يجب أن يكون 6 أحرف على الأقل',
                createAccount: 'إنشاء الحساب',
                orSignUpWith: 'أو التسجيل باستخدام',
                signUpPhone: 'التسجيل بواسطة الهاتف',
                hasAccount: 'لديك حساب بالفعل؟',
                signIn: 'تسجيل الدخول',
                successTitle: 'تحقق من بريدك الإلكتروني',
                successSubtitle: 'لقد أرسلنا لك رابط التحقق',
                successAlert: 'تم إرسال بريد إلكتروني للتحقق إلى {email}. يرجى التحقق من صندوق الوارد والنقر على رابط التحقق لتفعيل حسابك.',
                goToLogin: 'الذهاب لتسجيل الدخول',
                passwordsMismatch: 'كلمات المرور غير متوافقة',
                passwordMinLength: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'
            }
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
            eventTitle: 'عنوان الفعالية',
            eventDescription: 'الوصف',
            eventDescriptionPlaceholder: 'صف تفاصيل الفعالية...',
            eventDate: 'التاريخ',
            eventTime: 'الوقت',
            eventLocation: 'الموقع',
            eventLocationPlaceholder: 'مثلاً: قاعة المؤتمرات، الدور الثاني',
            maxAttendeesLabel: 'أقصى عدد للحضور',
            maxAttendeesHelper: 'إجمالي السعة الاستيعابية للفعالية',
            requiredAttendeesLabel: 'العدد المطلوب للحضور',
            requiredAttendeesHelper: 'الحد الأدنى من الحضور المطلوب',
            createButton: 'إنشاء الفعالية',
            cancelButton: 'إلغاء',
            creating: 'جارٍ الإنشاء...',
            createSuccess: 'تم إنشاء الفعالية بنجاح!',
            createError: 'فشل إنشاء الفعالية',
            confirmCreateTitle: 'إنشاء فعالية جديدة',
            confirmCreateMessage: 'هل أنت متأكد من رغبتك في إنشاء هذه الفعالية ونشرها؟',
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
            createUpcomingDesc: 'لا توجد فعاليات قادمة',
            createFinishedDesc: 'لا توجد فعاليات منتهية',
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
                ticketQuantity: 'العدد المتاح',
                ticketPrice: 'سعر التذكرة',
                registrationLink: 'رابط التسجيل',
                scanTickets: 'مسح التذاكر',
                overview: 'نظرة عامة',
                categories: 'فئات التذاكر',
                totalAttendees: 'إجمالي الحضور',
                checkedIn: 'تم الحضور',
                ticketsSold: 'التذاكر المباعة',
                sold: 'تم الحجز',
                qrCodePublicDesc: 'امسح هذا الرمز لعرض صفحة التسجيل العامة',
                attendeeList: 'قائمة الحضور والمدعوين',
                registered: 'مسجل',
                name: 'الاسم',
                company: 'الشركة / الجهة',
                phone: 'رقم الهاتف',
                action: 'الإجراء',
                pending: 'لم يحضر',
                checkIn: 'تحضير',
                noAttendees: 'لا يوجد مدعوين مسجلين حتى الآن',
                totalSeats: 'إجمالي المقاعد المخصصة',
                ticketCreated: 'تم إنشاء التذكرة بنجاح',
                deleteConfirm: 'هل أنت متأكد من حذف هذه الفعالية؟',
                deleteTicketConfirm: 'حذف هذه التذكرة؟',
                copied: 'تم نسخ رابط التسجيل للحافظة!',
                free: 'مجاني',
                deleteTicketTitle: 'حذف فئة التذاكر',
                deleteSuccess: 'تم حذف الفعالية بنجاح',
                deleteError: 'فشل حذف الفعالية',
                deleteTicketSuccess: 'تم حذف فئة التذكرة بنجاح',
                deleteTicketError: 'فشل حذف فئة التذكرة',
                ticketCreateError: 'فشل إنشاء التذكرة',
                checkInSuccess: 'تم التحضير بنجاح',
                checkInError: 'فشل عملية التحضير',
            }
        },
        scanner: {
            title: 'ماسح التذاكر (البوابة)',
            description: 'ضع رمز QR داخل المربع لمسحه والتحقق من التذكرة',
            invalidFormat: 'رمز غير صالح',
            checkInSuccess: 'تم التحضير بنجاح!',
            verifyFailed: 'فشل التحقق من التذكرة',
            waiting: 'في انتظار المسح...',
            reset: 'إعادة ضبط الماسح',
            manualEntryDesc: 'يرجى المحاولة مرة أخرى أو إدخال الكود يدوياً.',
            scanRegionDesc: 'منطقة المسح',
        },
        registration: {
            eventNotFound: 'عذراً، الحدث غير موجود',
            eventNotFoundDesc: 'يبدو أن الرابط غير صحيح أو أن التسجيل قد انتهى.',
            goHome: 'العودة للرئيسية',
            title: 'التسجيل في الحدث',
            fullName: 'الاسم الكامل',
            fullNamePlaceholder: 'أدخل اسمك الكامل',
            email: 'البريد الإلكتروني',
            phone: 'رقم الهاتف',
            company: 'الشركة / الجهة',
            companyPlaceholder: 'الشركة التي تمثلها',
            confirm: 'تأكيد التسجيل والحصول على التذكرة',
            successTitle: 'تهانينا! تم تسجيلك بنجاح',
            successDesc: 'شكراً لتسجيلك في {title}. يمكنك الآن تحميل تذكرتك الإلكترونية لاستخدامها عند الدخول.',
            downloadImage: 'تحميل كصورة',
            printTicket: 'طباعة التذكرة (PDF)',
            validation: {
                nameShort: 'الاسم قصير جداً',
                emailInvalid: 'بريد إلكتروني غير صالح',
                phoneShort: 'رقم هاتف غير صالح',
                companyRequired: 'اسم الشركة مطلوب'
            }
        },
        settings: {
            title: 'الإعدادات',
            description: 'إدارة حسابك وتفضيلاتك',
            account: 'الحساب',
            profile: 'الملف الشخصي',
            security: 'الأمان',
            notifications: 'الإشعارات',
            language: 'اللغة',
            fullName: 'الاسم الكامل',
            displayName: 'الاسم المعروض',
            bio: 'نبذة',
            avatar: 'صورة الملف الشخصي',
            changePassword: 'تغيير كلمة المرور',
            currentPassword: 'كلمة المرور الحالية',
            newPassword: 'كلمة المرور الجديدة',
            securityTitle: 'الأمان',
            securityDesc: 'يمكنك إعادة تعيين كلمة المرور من خلال صفحة تسجيل الدخول',
            plans: {
                title: 'باقات الاشتراك',
                currentPlan: 'باقتك الحالية',
                active: 'مفعلة',
                choosePlan: 'اختيار الباقة',
                monthly: 'شهرياً',
                annual: 'سنوياً',
                free: {
                    name: 'الباقة المجانية',
                    features: [
                        'حتى 5 فعاليات شهرياً',
                        '50 مدعو لكل فعالية',
                        'دعم البريد الإلكتروني'
                    ]
                },
                premium: {
                    name: 'الباقة المميزة',
                    features: [
                        'حتى 20 فعالية شهرياً',
                        '200 مدعو لكل فعالية',
                        'دعم فني سريع',
                        'تخصيص كامل للدعوات'
                    ]
                },
                professional: {
                    name: 'باقة المحترفين',
                    features: [
                        'فعاليات غير محدودة',
                        '1000 مدعو لكل فعالية',
                        'دعم هاتفي 24/7',
                        'إحصائيات متقدمة'
                    ]
                }
            }
        },
        calendar: {
            title: 'التقويم',
            description: 'عرض وإدارة فعالياتك',
            weekDays: {
                sun: 'الأحد',
                mon: 'الاثنين',
                tue: 'الثلاثاء',
                wed: 'الأربعاء',
                thu: 'الخميس',
                fri: 'الجمعة',
                sat: 'السبت'
            },
            more: 'إضافي',
            eventsOn: 'الفعاليات في يوم',
            addEvent: 'إضافة فعالية في هذا اليوم',
            noEvents: 'لا توجد فعاليات في هذا اليوم',
            createEvent: 'إنشاء فعالية',
            months: [
                'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
            ]
        }
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

