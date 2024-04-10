'use client';
import { Button } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function CommunityView({ params }: RouteArgs) {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div>
      community view
      <br />
      <Button>
        <Link href={`${pathname}/import`}>Import</Link>
      </Button>
    </div>
  );
}
