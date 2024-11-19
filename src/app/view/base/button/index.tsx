import {
  Button as NextUIButton,
  ButtonProps as NextUIButtonProps,
} from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { ConfirmationModalArg } from '~/view/base/confirmation-modal/helper';

export interface ButtonProps extends NextUIButtonProps {
  /**
   * Pop up a modal dialog to serve as additional confirmation before calling
   * the onPress action
   */
  confirmation?: boolean;
  confirmationArg?: ConfirmationModalArg;
  /**
   * This is only used when `confirmation` is true. Use this to run a custom
   * function before the confirmation dialog is shown. This is useful, for
   * example, when you want to validate form before deciding whether or not to
   * show the confirmation dialog
   *
   * - If the callback returns true, the confirmation dialog will open
   * - If the callback returns false, the confirmation dialog will not open
   */
  onConfirm?: () => Promise<boolean>;
}

type OnPressFn = NonNullable<NextUIButtonProps['onPress']>;

export const Button = React.forwardRef<HTMLButtonElement | null, ButtonProps>(
  ({ confirmation, confirmationArg, onConfirm, onPress, ...props }, ref) => {
    const buttonRef = useForwardRef<HTMLButtonElement>(ref);
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    const customOnPress = React.useCallback<OnPressFn>(
      async (evt) => {
        if (confirmation) {
          const showDialog = onConfirm ? await onConfirm() : true;
          if (showDialog) {
            open({
              ...confirmationArg,
              onConfirm: () => {
                if (props.type != null && props.type !== 'button') {
                  buttonRef.current.type = props.type;
                  buttonRef.current.click();
                  buttonRef.current.type = 'button';
                }
                onPress?.(evt);
              },
            });
          }
        } else {
          onPress?.(evt);
        }
      },
      [
        confirmation,
        confirmationArg,
        props.type,
        open,
        onConfirm,
        onPress,
        buttonRef,
      ]
    );

    return (
      <NextUIButton
        ref={buttonRef}
        onPress={customOnPress}
        {...props}
        /**
         * When confirmation dialog is enabled, need to handle submit/reset type
         * manually
         */
        {...(confirmation && { type: 'button' })}
      />
    );
  }
);

Button.displayName = 'Button';
