import {
  Button as NextUIButton,
  ButtonProps as NextUIButtonProps,
  Tooltip,
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
   * This option is only available when `confirmation` is true.
   *
   * When provided, this function is called to decide whether confirmation
   * dialog should open:
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
            onConfirm: async () => {
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
          });
        }
      },
      [
        confirmation,
        confirmationArg,
        type,
        open,
        beforeConfirm,
        onPress,
        buttonRef,
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
