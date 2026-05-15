'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env';
import { AppLogo } from '~/view/app-logo';
import { Button } from '~/view/base/button';
import { Icon } from '~/view/base/icon';
import { Modal } from '~/view/base/modal';
import { BuiltBy } from '~/view/footer/build-by';

export default function About() {
  const router = useRouter();
  return (
    <Modal
      size="lg"
      scrollBehavior="inside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <Modal.Content>
        <Modal.Header className="items-center gap-2">
          <AppLogo />
          {appTitle}
        </Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-[repeat(2,max-content)] gap-x-4 gap-y-2">
            <div className="italic">Version</div>
            <div className="truncate font-mono">
              {/*
               * Using process.env directly becuase these should be available
               * during docker build
               */}
              {process.env.NEXT_PUBLIC_APP_VERSION}
            </div>
            <div className="italic">Branch</div>
            <div className="truncate font-mono">
              {/*
               * Using process.env directly becuase these should be available
               * during docker build
               */}
              {process.env.NEXT_PUBLIC_GIT_BRANCH}
            </div>
            <div className="italic">Commit</div>
            <div className="truncate font-mono">
              {/*
               * Using process.env directly becuase these should be available
               * during docker build
               */}
              {process.env.NEXT_PUBLIC_GIT_COMMIT_HASH?.slice(0, 7)}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BuiltBy className="grow" />
          <Button
            color="primary"
            endContent={<Icon icon="email" />}
            onPress={() => router.push(appPath('contactUs'))}
          >
            {appLabel('contactUs')}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
