import './globals.css';
import React from 'react';
import { ThemeProvider } from '@medivo/theme';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

export const metadata = {
  title: 'Medivo Health Intelligence — Platform Admin Console',
  description: 'Enterprise administration dashboard for HIPAA audit logs, user management, and platform analytics.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen bg-surface text-ink-primary antialiased">
        <ThemeProvider defaultMode="system">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
