import './globals.css';
import React from 'react';
import { ThemeProvider } from '@medivo/theme';

export const metadata = {
  title: 'Medivo Health Intelligence — Doctor Portal',
  description: 'Clinical practitioner portal for dermatologist consultations, AI telemetry analysis, and prescription management.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen bg-surface text-ink-primary antialiased">
        <ThemeProvider defaultMode="system">
          <div className="flex-1 flex flex-col min-w-0">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
