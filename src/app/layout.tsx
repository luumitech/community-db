import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import { verifyEnvVar } from '~/util/env-var';
import { Providers } from './providers';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

verifyEnvVar();

export const metadata: Metadata = {
  title: 'Community DB',
  description: 'Community Household Database',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark text-foreground bg-background`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
