import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Operating System',
  description: 'AI-powered platform for creators',
};

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
