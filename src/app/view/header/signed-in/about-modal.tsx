import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { UseDisclosureReturn } from '@nextui-org/use-disclosure';
import React from 'react';

interface Props {
  disclosureProps: UseDisclosureReturn;
}

export const AboutModal: React.FC<Props> = ({ disclosureProps }) => {
  const { isOpen, onOpenChange, onClose } = disclosureProps;

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="top-center"
      scrollBehavior="inside"
      isKeyboardDismissDisabled={true}
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
              {process.env.NEXT_PUBLIC_APP_VERSION}
            </div>
            <div className="italic">Branch</div>
            <div className="font-mono">
              {process.env.NEXT_PUBLIC_GIT_BRANCH}
            </div>
            <div className="italic">Commit</div>
            <div className="font-mono text-ellipsis overflow-hidden">
              {process.env.NEXT_PUBLIC_GIT_COMMIT_HASH}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
