'use client';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { appTitle } from '~/lib/env-var';

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
          <div className="grid grid-cols-[auto_max-content] gap-2">
            <div className="italic">Version</div>
            <div className="font-mono">
              {/*
               * Not using next-runtime-env because these variables
               * are only available during build time during docker
               * build
               */}
              {process.env.NEXT_PUBLIC_APP_VERSION}
            </div>
            <div className="italic">Branch</div>
            <div className="font-mono">
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
              {process.env.NEXT_PUBLIC_GIT_COMMIT_HASH}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
