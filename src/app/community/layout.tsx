import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function CommunityLayout({ children }: LayoutProps) {
  return <div className="mx-page-x mt-page-top">{children}</div>;
}
