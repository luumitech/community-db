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
      ...props
    },
    ref
  ) => {
    const buttonRef = useForwardRef<HTMLButtonElement>(ref);
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    const customOnPress = React.useCallback<OnPressFn>(
      async (evt) => {
        if (confirmation) {
          const showDialog = (await beforeConfirm?.()) ?? true;
          if (showDialog) {
            open({
              ...confirmationArg,
              onConfirm: async () => {
                switch (props.type) {
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
        } else {
          onPress?.(evt);
        }
      },
      [
        confirmation,
        confirmationArg,
        props.type,
        open,
        beforeConfirm,
        onPress,
        buttonRef,
      ]
    );

    const renderButton = React.useMemo(() => {
      return (
        <NextUIButton
          ref={buttonRef}
          onPress={customOnPress}
          {...props}
          /**
           * When confirmation dialog is enabled, need to handle submit/reset
           * type manually. See logic in `customOnPress` above.
           */
          {...(confirmation && { type: 'button' })}
        />
      );
    }, [buttonRef, props, customOnPress, confirmation]);

    return tooltip ? (
      <Tooltip content={tooltip}>{renderButton}</Tooltip>
    ) : (
      renderButton
    );
  }
);

Button.displayName = 'Button';
