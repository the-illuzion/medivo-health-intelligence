import './globals.css';
import React from 'react';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import { ThemeProvider, ThemeScript } from '@medivo/theme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

const bodyFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#090D16' },
  ],
};

export const metadata: Metadata = {
  title: 'Medivo — Clinical AI Skin Intelligence & Tele-Dermatology Platform',
  description: 'Instant multi-spectral facial skin telemetry, board-certified telehealth consultations, and custom prescription formulations backed by 99.4% clinical diagnostic benchmarks.',
  keywords: ['AI skin analysis', 'dermatology telehealth', 'skin scan telemetry', 'custom skincare prescriptions', 'HIPAA compliant medical AI'],
  authors: [{ name: 'Medivo Health Intelligence Platform' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col bg-surface text-ink-primary font-sans antialiased selection:bg-brand-primary/20 selection:text-brand-primary">
        <ThemeProvider defaultMode="system">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
