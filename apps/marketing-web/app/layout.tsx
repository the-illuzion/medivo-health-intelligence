import './globals.css';
import React from 'react';
import { ThemeProvider, ThemeScript } from '@medivo/theme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export const metadata = {
  title: 'Medivo — Clinical AI Skin Intelligence Platform',
  description: 'Instant multi-spectral facial skin telemetry, board-certified telehealth consultations, and custom prescription formulations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-screen flex-col bg-surface text-ink-primary antialiased">
        <ThemeProvider defaultMode="system">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
