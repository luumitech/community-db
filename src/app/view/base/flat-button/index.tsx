import { Tooltip, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { ConfirmationModalArg } from '~/view/base/confirmation-modal/helper';
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
      const { icon, disabled, children, ...other } = props;

      return (
        <div
          ref={ref}
          role="button"
          className={cn(
            className,
            disabled ? 'opacity-disabled cursor-default' : 'hover:opacity-hover'
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
