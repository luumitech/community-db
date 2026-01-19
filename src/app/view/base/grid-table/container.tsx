import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from './_config';
import type { CommonProps } from './_type';

interface Props extends CommonProps {
  className?: string;
}

/**
 * Table container
 *
 * Defines the grid container, and the grid layout
 *
 * - By default, there are 8 equal columns
 */
export const Container = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<Props>
>((_props, ref) => {
  const { className, config, columnKeys, columnConfig, ...props } = _props;

  return (
    <div
      ref={ref}
      className={twMerge(
        'grid',
        CLASS_DEFAULT.gridContainer,
        config?.gridContainer,
        className
      )}
      {...props}
    />
  );
});

Container.displayName = 'Container';
