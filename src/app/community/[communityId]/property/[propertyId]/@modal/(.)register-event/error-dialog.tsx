import { useRouter } from 'next/navigation';
import React from 'react';
import { appLabel } from '~/lib/app-path';
import { Button } from '~/view/base/button';
import { Modal } from '~/view/base/modal';

interface Props {}

export const ErrorDialog: React.FC<Props> = (props) => {
  const router = useRouter();

  const goBack = React.useCallback(() => {
    router.back();
  }, [router]);

  return (
    <Modal
      isOpen
      onOpenChange={goBack}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <Modal.Content>
        {({ close }) => (
          <>
            <Modal.Header>{appLabel('registerEvent')}</Modal.Header>
            <Modal.Body>Error: Event Name missing</Modal.Body>
            <Modal.Footer>
              <Button variant="bordered" onPress={close}>
                OK
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};
