import { AlertDialog, Button } from '@heroui-v3/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface ContentArg {
  closeModal: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ConfirmationModalArg {
  /**
   * By default, if `content` is not specified, the confirmation modal will be
   * rendered with a default body, with cancel and OK button
   *
   * The body content can be customized
   */
  body?: React.ReactNode;

  /** Callback when OK button in the confirmation dialog is pressed */
  onConfirm?: () => void;
  /** Callback when cancel button in the confirmation dialog is pressed */
  onCancel?: () => void;
}

interface Props {}

/**
 * A confirmation modal that is supposed to be installed in the AppContext and
 * controlled by its helper hook useConfirmationModal
 */
export const ConfirmationModal: React.FC<Props> = () => {
  const { confirmationModal } = useAppContext();
  const { disclosure, arg } = confirmationModal;

  if (arg == null) {
    return null;
  }

  const { body, onConfirm, onCancel } = arg;

  return (
    <AlertDialog
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
    >
      <AlertDialog.Backdrop
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <AlertDialog.Container size="xs">
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status="warning" />
            </AlertDialog.Header>
            <AlertDialog.Body>{body ?? 'Discard Changes?'}</AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="outline"
                slot="close"
                onPress={(evt) => onCancel?.()}
              >
                Cancel
              </Button>
              <Button slot="close" onPress={(evt) => onConfirm?.()}>
                OK
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};
