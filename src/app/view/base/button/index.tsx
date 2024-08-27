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
}

type OnPressFn = NonNullable<NextUIButtonProps['onPress']>;

export const Button = React.forwardRef<HTMLButtonElement | null, ButtonProps>(
  ({ confirmation, confirmationArg, onPress, ...props }, ref) => {
    const buttonRef = useForwardRef<HTMLButtonElement>(ref);
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    const customOnPress = React.useCallback<OnPressFn>(
      (evt) => {
        if (confirmation) {
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
        } else {
          onPress?.(evt);
        }
      },
      [confirmation, confirmationArg, props.type, open, onPress, buttonRef]
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
