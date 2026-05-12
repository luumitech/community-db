import {
  Modal,
  cn,
  useOverlayState,
  type ModalBackdropProps,
  type ModalContainerProps,
  type ModalDialogProps,
  type UseOverlayStateReturn,
} from '@heroui-v3/react';
import React from 'react';
import * as R from 'remeda';

type CustomModalBackdropProps = Omit<
  ModalBackdropProps,
  'className' | 'children'
>;
type CustomModalContainerProps = Omit<
  ModalContainerProps,
  'className' | 'children'
>;
export interface PlainModalProps
  extends CustomModalBackdropProps, CustomModalContainerProps {
  hideCloseButton?: boolean;
  renderWrapper?: (
    modalDialog: React.ReactNode,
    clsNm: string
  ) => React.ReactNode;
  children: React.ReactNode;
}

const BACKDROP_PROPS = [
  'variant',
  'isDismissable',
  'isKeyboardDismissDisabled',
  'isOpen',
  'onOpenChange',
] as const;
const CONTAINER_PROPS = ['size', 'scroll', 'placement'] as const;

interface ContextT {
  modalState: UseOverlayStateReturn;
}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

const PlainModalImpl: React.FC<PlainModalProps> = ({
  hideCloseButton,
  renderWrapper,
  children,
  ...props
}) => {
  const { isOpen, onOpenChange, ...backdropProps } = R.pick(
    props,
    BACKDROP_PROPS
  );
  const containerProps = R.pick(props, CONTAINER_PROPS);
  const modalState = useOverlayState({
    isOpen,
    onOpenChange,
  });

  const modalDialog = React.useMemo(
    () => (
      <Modal.Dialog>
        {!hideCloseButton && <Modal.CloseTrigger />}
        {children}
      </Modal.Dialog>
    ),
    [hideCloseButton, children]
  );

  const { size = 'md', scroll = 'inside' } = containerProps;

  return (
    <Context.Provider value={{ modalState }}>
      <Modal>
        <Modal.Backdrop
          isOpen={modalState.isOpen}
          onOpenChange={modalState.setOpen}
          {...backdropProps}
        >
          <Modal.Container {...containerProps}>
            {renderWrapper?.(
              modalDialog,
              cn(
                /**
                 * When rendering children inside Modal.Dialog, it is necessary
                 * to style the wrapper divs with the same classNames as the
                 * Modal.Dialog
                 */
                'modal__dialog',
                `modal__dialog--scroll-${scroll}`,
                `modal__dialog--${size}`,
                // The padding is already added by the dialog, remove the inner div
                'p-0'
              )!
            ) ?? modalDialog}
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </Context.Provider>
  );
};

const PlainModalContent: React.FC<ModalDialogProps> = ({ children }) => {
  const context = React.useContext(Context);
  const { close } = context.modalState;

  return typeof children === 'function' ? children({ close }) : children;
};

type PlainModal = typeof PlainModalImpl & {
  Content: typeof PlainModalContent;
  Header: typeof Modal.Header;
  Body: typeof Modal.Body;
  Footer: typeof Modal.Footer;
};

export const PlainModal = PlainModalImpl as PlainModal;
PlainModal.Content = PlainModalContent;
PlainModal.Header = Modal.Header;
PlainModal.Body = Modal.Body;
PlainModal.Footer = Modal.Footer;
