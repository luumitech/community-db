'use client';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { appTitle } from '~/lib/env';
import { AppLogo } from '~/view/app-logo';
import { Icon } from '~/view/base/icon';
import { BuiltBy } from '~/view/footer/build-by';

export default function About() {
  const router = useRouter();
  return (
    <Modal
      size="lg"
      placement="top-center"
      scrollBehavior="inside"
      isOpen
      onOpenChange={() => router.back()}
      isDismissable
      // isKeyboardDismissDisabled
    >
      <ModalContent>
        <ModalHeader className="items-center gap-2">
          <AppLogo />
          {appTitle}
        </ModalHeader>
        <ModalBody>
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
        </ModalBody>
        <ModalFooter>
          <BuiltBy className="grow" />
          <Button
            color="primary"
            endContent={<Icon icon="email" />}
            onPress={() => router.push(appPath('contactUs'))}
          >
            {appLabel('contactUs')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
