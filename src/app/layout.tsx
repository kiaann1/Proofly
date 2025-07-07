import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainNavigation from "../components/layout/MainNavigation";
import GlobalFooter from "../components/layout/GlobalFooter";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Proofly - Free Professional CV Builder & Resume Tools",
    template: "%s | Proofly"
  },
  description: "Create professional resumes and CVs for free with our ATS-optimised builder. Features include grammar checking, cover letter generator, and expert career advice.",
  keywords: [
    'free CV builder', 'resume builder', 'ATS optimisation', 'professional resume',
    'cover letter generator', 'career advice', 'job search tools', 'resume templates',
    'CV templates', 'free resume maker', 'professional CV', 'ATS friendly resume',
    'job application tools', 'career development', 'resume writing tips'
  ],
  authors: [{ name: 'Proofly' }],
  creator: 'Proofly',
  publisher: 'Proofly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://prooflycv.vercel.app/'),
  openGraph: {
    title: 'Proofly - Free Professional CV Builder & Resume Tools',
    description: 'Create professional resumes and CVs for free with our ATS-optimised builder. Features include grammar checking, cover letter generator, and expert career advice.',
    url: 'https://prooflycv.vercel.app/',
    siteName: 'Proofly',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Proofly - Free Professional CV Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proofly - Free Professional CV Builder & Resume Tools',
    description: 'Create professional resumes and CVs for free with our ATS-optimised builder. Features include grammar checking, cover letter generator, and expert career advice.',
    images: ['/og-image.png'],
    creator: '@proofly',
    site: '@proofly',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      // Using only available icons
    ],
    apple: [
      // Apple touch icon removed
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#2563eb',
      },
    ],
  },
  manifest: '/site.webmanifest',
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    other: {
      'msvalidate.01': 'your-bing-verification-code',
    },
  },
  category: 'technology',
  classification: 'Business Tools',
  referrer: 'origin-when-cross-origin',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Proofly',
    'application-name': 'Proofly',
    'msapplication-TileColor': '#2563eb',
    'theme-color': '#ffffff',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Global structured data for the website
  const globalStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://prooflycv.vercel.app/#website",
        "url": "https://prooflycv.vercel.app",
        "name": "Proofly",
        "description": "Free Professional CV Builder & Resume Tools",
        "publisher": {
          "@id": "https://prooflycv.vercel.app/#organisation"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://prooflycv.vercel.app/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Organisation",
        "@id": "https://prooflycv.vercel.app/#organisation",
        "name": "Proofly",
        "url": "https://prooflycv.vercel.app",
        "logo": {
          "@type": "ImageObject",
          "inLanguage": "en-US",
          "@id": "https://prooflycv.vercel.app/#/schema/logo/image/",
          "url": "https://prooflycv.vercel.app/logo.png",
          "contentUrl": "https://prooflycv.vercel.app/logo.png",
          "width": 512,
          "height": 512,
          "caption": "Proofly"
        },
        "image": {
          "@id": "https://prooflycv.vercel.app/#/schema/logo/image/"
        },
        "description": "Free Professional CV Builder & Resume Tools",
        "sameAs": [
          "https://twitter.com/proofly",
          "https://linkedin.com/company/proofly",
          "https://facebook.com/proofly"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "Customer Service",
          "areaServed": "Worldwide",
          "availableLanguage": ["English"]
        }
      },
      {
        "@type": "WebApplication",
        "name": "Proofly CV Builder",
        "url": "https://prooflycv.vercel.app/cv",
        "description": "Free online CV and resume builder with ATS optimisation",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "permissions": "No registration required",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Completely free to use"
        },
        "featureList": [
          "ATS-optimised resume templates",
          "Professional cover letter generator", 
          "Grammar and style checking",
          "Multiple export formats (PDF, DOCX)",
          "Real-time preview",
          "No registration required"
        ]
      }
    ]  };
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Global Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalStructuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <MainNavigation />
        <main>
          {children}
        </main>
        <GlobalFooter />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
