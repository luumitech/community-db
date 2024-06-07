'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { ListBox } from '~/view/base/list-box';
import { NotSignedIn } from './not-signed-in';

interface Props {}

export const Landing: React.FC<Props> = ({}) => {
  const { data: session } = useSession();

  if (!session) {
    return <NotSignedIn />;
  }

  return (
    <ListBox
      header="Welcome!"
      items={[
        {
          key: 'select-community',
          href: '/community/select',
          children: 'Select Community',
        },
        {
          key: 'create-community',
          href: '/community/create',
          children: 'Create New Community',
        },
      ]}
    />
  );
};
