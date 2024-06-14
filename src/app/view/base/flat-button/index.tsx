import { Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon, type IconProps } from '~/view/base/icon';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  className?: string;
  icon: IconProps['icon'];
  /**
   * Tooltip description
   */
  tooltip?: string;
}

export const FlatButton: React.FC<Props> = ({
  className,
  tooltip,
  ...props
}) => {
  const renderButton = React.useMemo(() => {
    const { icon, ...other } = props;

    return (
      <span
        role="button"
        className={clsx(
          className,
          'opacity-80 hover:opacity-100 active:opacity-50'
        )}
        {...other}
      >
        <Icon icon={icon} size={16} />
      </span>
    );
  }, [className, props]);

  return tooltip ? (
    <Tooltip content={tooltip}>{renderButton}</Tooltip>
  ) : (
    renderButton
  );
};
