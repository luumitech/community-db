import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { appDescription, appTitle } from '~/lib/env';
import { nextPublicSchema } from '~/lib/env/env-schema';
import { getEnv } from '~/lib/env/server-env';
import { Header } from '~/view/header';
import { Providers } from './providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

/**
 * Get NEXT_PUBLIC environment varibles and pass them along to all client
 * routes,
 *
 * We don't want to access them directly in the client route because NextJS
 * would replace them with hard coded values in build time. We retrieve the
 * values from the server so the values will reflect the runtime values
 */
function getNextPublicEnv() {
  const envObj = getEnv();

  const nextPublicEnvKeys = nextPublicSchema.keyof().options;
  const nextPublicEnv = R.pick(envObj, nextPublicEnvKeys);
  return nextPublicEnv;
}

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
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={twMerge(inter.className)}>
        <Providers env={getNextPublicEnv()}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main>{children}</main>
          </div>
          {modal}
        </Providers>
      </body>
    </html>
  );
}
