import { Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useForwardRef } from '~/custom-hooks/forward-ref';
import { ConfirmationModalArg } from '~/view/base/confirmation-modal/helper';
import { Icon, type IconProps } from '~/view/base/icon';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  className?: string;
  icon: IconProps['icon'];
  disabled?: boolean;
  /**
   * Tooltip description
   */
  tooltip?: string;
  /**
   * Pop up a modal dialog to serve as additional confirmation
   * before calling the onPress action
   */
  confirmation?: boolean;
  confirmationArg?: ConfirmationModalArg;
}

type OnClickFn = NonNullable<Props['onClick']>;

export const FlatButton = React.forwardRef<HTMLSpanElement, Props>(
  (
    { className, tooltip, confirmation, confirmationArg, onClick, ...props },
    ref
  ) => {
    const spanRef = useForwardRef<HTMLSpanElement>(ref);
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    const customOnClick = React.useCallback<OnClickFn>(
      (evt) => {
        if (confirmation) {
          open({
            ...confirmationArg,
            onConfirm: () => {
              onClick?.(evt);
            },
          });
        } else {
          onClick?.(evt);
        }
      },
      [confirmation, confirmationArg, open, onClick]
    );

    const renderButton = React.useMemo(() => {
      const { icon, disabled, ...other } = props;

      return (
        <span
          ref={spanRef}
          role="button"
          className={clsx(
            className,
            disabled ? 'opacity-disabled cursor-default' : 'hover:opacity-hover'
          )}
          onClick={customOnClick}
          {...other}
        >
          <Icon icon={icon} size={16} />
        </span>
      );
    }, [spanRef, className, props, customOnClick]);

    return tooltip ? (
      <Tooltip content={tooltip}>{renderButton}</Tooltip>
    ) : (
      renderButton
    );
  }
);

FlatButton.displayName = 'FlatButton';
