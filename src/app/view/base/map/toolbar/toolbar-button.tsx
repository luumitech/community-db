import { cn } from '@heroui/react';
import React from 'react';
import { Icon, type IconProps } from '~/view/base/icon';
import { Tooltip } from '~/view/base/tooltip';

type AnchorProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

interface Props extends AnchorProps {
  icon: IconProps['icon'];
}

export const ToolbarButton: React.FC<Props> = ({
  className,
  icon,
  ...props
}) => {
  const renderAnchor = React.useMemo(
    () => (
      <a className={cn('cursor-pointer', className)} role="button" {...props}>
        <div className="flex h-full w-full items-center justify-center">
          <Icon icon={icon} size={20} />
        </div>
      </a>
    ),
    [className, icon, props]
  );

  if (props.title) {
    return (
      <Tooltip isFixed content={props.title}>
        {renderAnchor}
      </Tooltip>
    );
  }

  return renderAnchor;
};
