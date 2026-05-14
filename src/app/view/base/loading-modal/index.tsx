import { Spinner } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { Modal } from '~/view/base/modal';

interface Props {}

/**
 * A loading modal that is supposed to be installed in the AppContext and
 * controlled by its helper hook useLoadingModal
 */
export const LoadingModal: React.FC<Props> = () => {
  const { loadingModal } = useAppContext();
  const { isLoading } = loadingModal;

  return (
    <Modal
      size="xs"
      isOpen={isLoading}
      variant="opaque"
      hideCloseButton
      isDismissable={false}
    >
      <Modal.Content>
        <Modal.Body className="my-6 flex items-center">
          <div className="text-xl">Please wait...</div>
          <Spinner className="" variant="wave" size="lg" />
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};
