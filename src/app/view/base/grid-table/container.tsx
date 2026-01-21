import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from './_config';
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
>((props, ref) => {
  const commonProps = R.pick(props, COMMON_PROPS);
  const _otherProps = R.omit(props, COMMON_PROPS);
  const { config } = commonProps;
  const { className, ...otherProps } = _otherProps;

  return (
    <div
      ref={ref}
      className={twMerge(
        'grid',
        CLASS_DEFAULT.gridContainer,
        config?.gridContainer,
        className
      )}
      {...otherProps}
    />
  );
});

Container.displayName = 'Container';
