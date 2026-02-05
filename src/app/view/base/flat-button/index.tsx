import { Tooltip, cn } from '@heroui/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useAppContext } from '~/custom-hooks/app-context';
import { type ConfirmationModalArg } from '~/view/base/confirmation-modal';
import { Icon, type IconProps } from '~/view/base/icon';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface Props extends DivProps {
  className?: string;
  /** Render a plain button with an icon. */
  icon?: IconProps['icon'];
  disabled?: boolean;
  /**
   * The link will be rendered as a block element with a hover effect, this is
   * to mirror Link component
   */
  isBlock?: boolean;
  /** Tooltip description */
  tooltip?: string;
  /**
   * Pop up a modal dialog to serve as additional confirmation before calling
   * the onPress action
   */
  confirmation?: boolean;
  confirmationArg?: ConfirmationModalArg;
  onClick?: DivProps['onClick'];
}

type OnClickFn = NonNullable<Props['onClick']>;

export const FlatButton = React.forwardRef<HTMLDivElement, Props>(
  (
    { className, tooltip, confirmation, confirmationArg, onClick, ...props },
    ref
  ) => {
    const { confirmationModal } = useAppContext();
    const { open } = confirmationModal;

    const customOnClick = React.useCallback<OnClickFn>(
      (evt) => {
        if (confirmation) {
          open({
            ...confirmationArg,
            onConfirm: () => {
              confirmationArg?.onConfirm?.();
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
      const { icon, disabled, isBlock, children, ...other } = props;

      return (
        <div
          ref={ref}
          role="button"
          className={twMerge(
            disabled
              ? 'cursor-default opacity-disabled'
              : 'cursor-pointer hover:opacity-hover',
            isBlock &&
              cn(
                'px-2 py-1',
                !disabled &&
                  cn(
                    'relative after:absolute',
                    'after:inset-0 after:rounded-xl',
                    'after:opacity-0 after:transition-background',
                    'hover:after:bg-primary/20 hover:after:opacity-100'
                  )
              ),
            className
          )}
          {...(!disabled && { onClick: customOnClick })}
          {...other}
        >
          {icon != null && <Icon icon={icon} size={16} />}
          {children}
        </div>
      );
    }, [ref, className, props, customOnClick]);

    return tooltip ? (
      <Tooltip content={tooltip}>{renderButton}</Tooltip>
    ) : (
      renderButton
    );
  }
);

FlatButton.displayName = 'FlatButton';
