import type { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { Inter } from 'next/font/google';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import { authOptions } from '~/api/auth/[...nextauth]/auth-options';
import { Header } from '~/view/header';
import { Providers } from './providers';

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Community DB',
  description: 'Community Household Database',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${inter.className} dark text-foreground bg-background`}>
        <Providers sessionProviderProps={{ session }}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex grow mt-2 mx-2">{children}</main>
          </div>
          <ToastContainer position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
