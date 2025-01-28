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
import { appTitle } from '~/lib/env-var';
import { Icon } from '~/view/base/icon';
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
      <ModalContent>
        <ModalHeader>{appTitle}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-[repeat(2,max-content)] gap-y-2 gap-x-4">
            <div className="italic">Version</div>
            <div className="font-mono text-ellipsis overflow-hidden">
              {/*
               * Not using next-runtime-env because these variables
               * are only available during build time during docker
               * build
               */}
              {process.env.NEXT_PUBLIC_APP_VERSION}
            </div>
            <div className="italic">Branch</div>
            <div className="font-mono text-ellipsis overflow-hidden">
              {/*
               * Not using next-runtime-env because these variables
               * are only available during build time during docker
               * build
               */}
              {process.env.NEXT_PUBLIC_GIT_BRANCH}
            </div>
            <div className="italic">Commit</div>
            <div className="font-mono text-ellipsis overflow-hidden">
              {/*
               * Not using next-runtime-env because these variables
               * are only available during build time during docker
               * build
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
