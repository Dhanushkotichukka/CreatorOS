import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'Creator Operating System',
  description: 'AI-powered platform for creators',
};

import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { SessionProvider } from 'next-auth/react';

import { ThemeProvider } from "@/components/theme-provider";

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
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="flex h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
              <Toaster position="bottom-right" theme="dark" />
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
