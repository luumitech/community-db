'use client';
import { cn } from '@heroui/react';
import React from 'react';
import { GuideMenu } from './guide-menu';

interface LayoutProps {
  children: React.ReactNode;
}

export default function TutorialLayout({ children }: LayoutProps) {
  return (
    <div className="ml-page-x flex h-main-height">
      <GuideMenu />
      <div
        className={cn(
          'grow overflow-auto',
          // Add padding on top and left, so card shadow is visible
          'px-2 pt-3'
        )}
      >
        {children}
      </div>
    </div>
  );
}
