import { cn } from '@heroui/react';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { PublicEnvScript } from 'next-runtime-env';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import React from 'react';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import { appDescription, appTitle } from '~/lib/env-var';
import { Header } from '~/view/header';
import { Providers } from './providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: appTitle,
  description: appDescription,
  applicationName: appTitle,
  openGraph: {
    siteName: appTitle,
    type: 'website',
    locale: 'en_US',
  },
  keywords: [
    'community',
    'database',
    'non-profit',
    'easy to use',
    'membership',
    'event registration',
    'safe and secure',
    'multiple administrator',
    'membership statistics',
  ],
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: 'index, follow',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default async function RootLayout({ children, modal }: RootLayoutProps) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/**
         * The suspense is to get around a hydration warning when using cypress
         *
         * See: https://github.com/expatfile/next-runtime-env/issues/107
         */}
        <React.Suspense>
          <PublicEnvScript />
        </React.Suspense>
      </head>
      <body className={cn(inter.className, 'text-foreground bg-background')}>
        {/**
         * Light/dark theme can be customized
         *
         * See: https://nextui.org/docs/customization/customize-theme
         */}
        <ThemeProvider defaultTheme="system" attribute="class">
          <Providers sessionProviderProps={{ session }}>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main>{children}</main>
            </div>
            {modal}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
