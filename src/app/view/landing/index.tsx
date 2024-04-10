'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MainMenu } from '~/view/main-menu';
import { NotSignedIn } from './not-signed-in';

interface Props {}

export const Landing: React.FC<Props> = ({}) => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return <NotSignedIn />;
  }

  return (
    <MainMenu
      header="Welcome!"
      items={[
        {
          id: 'select-community',
          name: 'Select Community',
          href: '/community/select',
        },
        {
          id: 'create-community',
          name: 'Create New Community',
          href: '/community/create',
        },
      ]}
    />
  );
};
