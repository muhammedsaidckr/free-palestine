import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { Analytics } from "@vercel/analytics/next";
import { StructuredData } from "@/components/StructuredData";
import { ResourcePreloader } from "@/components/ResourcePreloader";
import { PerformanceMonitor } from "@/components/PerformanceMonitor";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ozgurfilistin.tr'),
  title: {
    default: "Özgür Filistin - Free Palestine Türkiye",
    template: "%s | Özgür Filistin"
  },
  description: "Türkiye'den Filistin'e destek. Filistin için birlikte duralım. Bilgilendirme, farkındalık ve dayanışma platformu.",
  keywords: ["Filistin", "Palestine", "Türkiye", "Turkey", "destek", "support", "özgürlük", "freedom", "dayanışma", "solidarity", "boykot", "boycott", "insan hakları", "human rights", "gazze", "gaza", "batı şeria", "west bank", "işgal", "occupation"],
  authors: [{ name: "Özgür Filistin Türkiye", url: "https://ozgurfilistin.tr" }],
  creator: "Özgür Filistin Türkiye",
  publisher: "Özgür Filistin Türkiye",
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
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: "en_US",
    url: "https://ozgurfilistin.tr",
    title: "Özgür Filistin - Free Palestine Türkiye",
    description: "Türkiye'den Filistin'e destek. Filistin için birlikte duralım. Bilgilendirme, farkındalık ve dayanışma platformu.",
    siteName: "Özgür Filistin",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Free Palestine Turkey - Solidarity Movement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ozgurfilistin",
    creator: "@ozgurfilistin",
    title: "Özgür Filistin - Free Palestine Türkiye",
    description: "Türkiye'den Filistin'e destek. Filistin için birlikte duralım.",
    images: ["/hero.jpg"],
  },
  alternates: {
    canonical: "https://ozgurfilistin.tr",
    languages: {
      'tr': 'https://ozgurfilistin.tr',
      'en': 'https://ozgurfilistin.tr?lang=en',
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "Society & Politics",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="16x16 32x32" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <StructuredData type="website" />
        <StructuredData type="organization" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ResourcePreloader 
          images={['/hero.jpg', '/logo.svg']}
        />
        <PerformanceMonitor />
        <ServiceWorkerRegistration />
        <I18nProvider>
          {children}
          {process.env.NODE_ENV === 'production' && process.env.VERCEL && <Analytics />}
        </I18nProvider>
      </body>
    </html>
  );
}
