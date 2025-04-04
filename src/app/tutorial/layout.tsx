'use client';
import React from 'react';
import { GuideMenu } from './guide-menu';

interface LayoutProps {
  children: React.ReactNode;
}

export default function TutorialLayout({ children }: LayoutProps) {
  return (
    <div className="flex gap-2 mx-2 h-main-height">
      <GuideMenu />
      {children}
    </div>
  );
}
