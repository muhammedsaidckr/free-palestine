import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Özgür Filistin - Free Palestine Türkiye",
  description: "Türkiye'den Filistin'e destek. Filistin için birlikte duralım. Bilgilendirme, farkındalık ve dayanışma platformu.",
  keywords: "Filistin, Palestine, Türkiye, Turkey, destek, support, özgürlük, freedom, dayanışma, solidarity",
  authors: [{ name: "Özgür Filistin Türkiye" }],
  openGraph: {
    title: "Özgür Filistin - Free Palestine Türkiye",
    description: "Türkiye'den Filistin'e destek. Filistin için birlikte duralım.",
    type: "website",
    locale: "tr_TR",
    url: "https://ozgurfilistin.tr",
    siteName: "Özgür Filistin",
  },
  alternates: {
    canonical: "https://ozgurfilistin.tr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
