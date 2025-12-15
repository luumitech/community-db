import { initClient } from '@ts-rest/core';
import { StatusCodes } from 'http-status-codes';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { appDescription, appTitle } from '~/lib/env';
import { env } from '~/lib/env/server-env';
import { Header } from '~/view/header';
import { contract } from './api/contract';
import { Providers } from './providers';

import './globals.css';

/* Initialize TSR client */
const tsr = initClient(contract, { baseUrl: env('NEXT_PUBLIC_HOSTNAME') });
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
  const envResp = await tsr.env();
  if (envResp.status !== StatusCodes.OK) {
    throw new Error('Unable to load environment variables');
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={twMerge(inter.className)}>
        {/**
         * Light/dark theme can be customized
         *
         * See: https://nextui.org/docs/customization/customize-theme
         */}
        <ThemeProvider defaultTheme="system" attribute="class">
          <Providers env={envResp.body}>
            <div className="flex min-h-screen flex-col">
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
