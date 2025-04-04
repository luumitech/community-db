'use client';
import { cn } from '@heroui/react';
import React from 'react';
import { GuideMenu } from './guide-menu';

interface LayoutProps {
  children: React.ReactNode;
}

export default function TutorialLayout({ children }: LayoutProps) {
  return (
    <div className="flex mt-page-top ml-page-x h-main-height">
      <GuideMenu />
      <div
        className={cn(
          'flex-grow overflow-auto',
          // Add padding on top and left, so card shadow is visible
          'pt-3 px-2'
        )}
      >
        {children}
      </div>
    </div>
  );
}
