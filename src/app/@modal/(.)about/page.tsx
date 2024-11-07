'use client';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { env } from 'next-runtime-env';
import { useRouter } from 'next/navigation';
import React from 'react';

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
        <ModalHeader>Community Database</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-[auto_max-content] gap-2">
            <div className="italic">Version</div>
            <div className="font-mono">
              {/*
               * Not using next-runtime-env because these variables
               * are only available during build time during docker
               * build
               */}
              {env('NEXT_PUBLIC_APP_VERSION')}
            </div>
            <div className="italic">Branch</div>
            <div className="font-mono">{env('NEXT_PUBLIC_GIT_BRANCH')}</div>
            <div className="italic">Commit</div>
            <div className="font-mono text-ellipsis overflow-hidden">
              {env('NEXT_PUBLIC_GIT_COMMIT_HASH')}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
