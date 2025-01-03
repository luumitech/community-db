import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function CommunityLayout({ children }: LayoutProps) {
  return <div className="mt-page-top mx-page-x">{children}</div>;
}
