import './globals.css';
import React from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

export const metadata = {
  title: 'Medivo — Clinical AI Skin Intelligence Platform',
  description: 'Instant multi-spectral facial skin telemetry, board-certified telehealth consultations, and custom prescription formulations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-[#0b0f17] text-slate-100 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
