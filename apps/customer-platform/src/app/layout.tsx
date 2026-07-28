import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/theme/theme-provider';

export const metadata: Metadata = {
  title: 'Medivo Health Intelligence - Customer Portal',
  description: 'AI-powered health and skin intelligence ecosystem.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 selection:bg-indigo-100 min-h-screen" suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
