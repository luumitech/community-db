'use client';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { AppLogo } from '~/view/app-logo';
import { Icon } from '~/view/base/icon';
import { ListBox } from '~/view/base/list-box';

export default function CommunityLanding() {
  const router = useRouter();

  return (
    <div>
      <ListBox
        header={
          <div className="flex items-center gap-2">
            <AppLogo size={36} transparentBg />
            Welcome!
          </div>
        }
        footer={
          <>
            <div className="flex-grow" />
            <Button
              variant="light"
              size="sm"
              startContent={<Icon icon="back" />}
              onPress={() => router.back()}
            >
              Back
            </Button>
          </>
        }
        items={[
          {
            key: 'select-community',
            href: appPath('communitySelect'),
            children: appLabel('communitySelect'),
          },
          {
            key: 'create-community',
            href: appPath('communityCreate'),
            children: appLabel('communityCreate'),
          },
        ]}
      />
    </div>
  );
}
