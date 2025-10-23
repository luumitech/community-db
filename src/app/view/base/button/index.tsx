import {
  Button as NextUIButton,
  ButtonProps as NextUIButtonProps,
  Tooltip,
} from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { type ConfirmationModalArg } from '~/view/base/confirmation-modal';

export interface ButtonProps extends NextUIButtonProps {
  /**
   * Pop up a modal dialog to serve as additional confirmation before calling
   * the onPress action
   */
  confirmation?: boolean;
  confirmationArg?: ConfirmationModalArg;
  /**
   * This option is only available when `confirmation` is true.
   *
   * When provided, this async function is called to decide whether confirmation
   * dialog should open. This is useful if you want to run a validation first
   * before showing the confirmation dialog. (By default, validation is run when
   * you submit)
   *
   * - If the callback returns true, the confirmation dialog will open
   * - If the callback returns false, the confirmation dialog will not open
   * - If the callback is not provided, the confirmation dialog will open
   */
  beforeConfirm?: () => Promise<boolean>;
  /** Tooltip description */
  tooltip?: string;
}

type OnPressFn = NonNullable<NextUIButtonProps['onPress']>;

export const Button = React.forwardRef<HTMLButtonElement | null, ButtonProps>(
  (
    {
      confirmation,
      confirmationArg,
      beforeConfirm,
      tooltip,
      onPress,
      type,
      ...props
    },
    ref
  ) => {
    const buttonRef = useForwardRef<HTMLButtonElement>(ref);
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    /**
     * When confirmation dialog is enabled, the original button type is
     * modified.
     *
     * So this logic is used to simulates the original button press action
     */
    const simulateOnPress = React.useCallback<OnPressFn>(
      (evt) => {
        switch (type) {
          case 'submit':
            {
              const form = buttonRef.current.closest('form');
              form?.requestSubmit();
            }
            break;
          case 'reset':
            {
              const form = buttonRef.current.closest('form');
              form?.reset();
            }
            break;
          case 'button':
          default:
            break;
        }
        onPress?.(evt);
      },
      [buttonRef, onPress, type]
    );

    const customOnPress = React.useCallback<OnPressFn>(
      async (evt) => {
        if (!confirmation) {
          onPress?.(evt);
          return;
        }
        const showDialog = (await beforeConfirm?.()) ?? true;
        if (showDialog) {
          open({
            ...confirmationArg,
            onConfirm: () => {
              confirmationArg?.onConfirm?.();
              simulateOnPress(evt);
            },
          });
        }
      },
      [
        confirmation,
        beforeConfirm,
        onPress,
        open,
        confirmationArg,
        simulateOnPress,
      ]
    );

    const renderButton = React.useMemo(
      () => (
        <NextUIButton
          ref={buttonRef}
          onPress={customOnPress}
          type={type}
          /**
           * When confirmation dialog is enabled, override the default button
           * type, so we can handle submit/reset type manually. See logic in
           * `customOnPress` above.
           */
          {...(confirmation && { type: 'button' })}
          {...props}
        />
      ),
      [buttonRef, confirmation, customOnPress, props, type]
    );

    if (tooltip) {
      return <Tooltip content={tooltip}>{renderButton}</Tooltip>;
    }

    return renderButton;
  }
);

Button.displayName = 'Button';
