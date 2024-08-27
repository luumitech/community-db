import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function CommunityLayout({ children }: LayoutProps) {
  return <div className="mt-page-top mx-page-x">{children}</div>;
}

/**
 * Protect all the pages below this route
 *
 * See:
 * https://next-auth.js.org/getting-started/client#custom-client-session-handling
 */
CommunityLayout.auth = true;
