import { ButtonProps, Button as NextUIButton } from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { ConfirmationModalArg } from '~/view/base/confirmation-modal/helper';

interface Props extends ButtonProps {
  /**
   * Pop up a modal dialog to serve as additional confirmation
   * before calling the onPress action
   */
  confirmation?: boolean;
  confirmationArg?: ConfirmationModalArg;
}

type OnPressFn = NonNullable<ButtonProps['onPress']>;

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ confirmation, confirmationArg, onPress, ...props }, ref) => {
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    const customOnPress = React.useCallback<OnPressFn>(
      (evt) => {
        if (confirmation) {
          open({
            ...confirmationArg,
            onConfirm: () => onPress?.(evt),
          });
        } else {
          onPress?.(evt);
        }
      },
      [confirmation, confirmationArg, open, onPress]
    );

    return <NextUIButton ref={ref} onPress={customOnPress} {...props} />;
  }
);

Button.displayName = 'Button';
