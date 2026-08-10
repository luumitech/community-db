import { cn } from '@heroui/react';
import { UseDisclosureReturn } from '@heroui/use-disclosure';
import React from 'react';
import { Button } from '~/view/base/button';
import { Form } from '~/view/base/form';
import { Link } from '~/view/base/link';
import { Modal } from '~/view/base/modal';
import type { PropertyEntry } from '../../_type';
import { GoogleExportPreview } from './google-export-preview';
import { toGoogleCustomMapCSV } from './google-export-util';

export interface ModalArg {
  /** Applicable property list */
  propertyList: PropertyEntry[];
  /** Export As file name */
  exportFn: string;
}

interface Props extends ModalArg {
  disclosure: UseDisclosureReturn;
  onSave: (csv: string) => Promise<void>;
}

export const ModalImpl: React.FC<Props> = ({
  propertyList,
  exportFn,
  disclosure,
  onSave,
}) => {
  const { isOpen, onOpenChange, onClose } = disclosure;
  const [pending, startTransition] = React.useTransition();

  const csv = React.useMemo(
    () => toGoogleCustomMapCSV(propertyList),
    [propertyList]
  );

  const onSubmit = React.useCallback(async () => {
    startTransition(async () => {
      try {
        await onSave(csv);
        onClose();
      } catch (err) {
        // error handled by parent
      }
    });
  }, [csv, onSave, onClose]);

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scrollBehavior="inside"
      isDismissable={false}
      isKeyboardDismissDisabled={true}
    >
      <Form onSubmit={onSubmit}>
        <Modal.Content>
          {(closeModal) => (
            <>
              <Modal.Header>
                <span>
                  Export to{' '}
                  <Link
                    className="text-[length:inherit]"
                    href="https://mymaps.google.com/"
                    isExternal
                    showAnchorIcon
                  >
                    Google Custom Map
                  </Link>
                </span>
              </Modal.Header>
              <Modal.Body>
                <GoogleExportPreview csv={csv} />
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="bordered"
                  isDisabled={pending}
                  onPress={closeModal}
                >
                  Cancel
                </Button>
                <Button type="submit" color="primary" isLoading={pending}>
                  Download CSV
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal.Content>
      </Form>
    </Modal>
  );
};
