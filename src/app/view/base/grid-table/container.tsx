import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from './_config';
import type { CommonProps } from './_type';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface Props extends CommonProps, DivProps {
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
  const { className, ...otherProps } = props;
  const commonProps = R.pick(props, COMMON_PROPS);
  const divProps = R.omit(otherProps, COMMON_PROPS);
  const { config } = commonProps;

  return (
    <div
      ref={ref}
      className={twMerge(
        'grid',
        CLASS_DEFAULT.gridContainer,
        config?.gridContainer,
        className
      )}
      {...divProps}
    />
  );
});

Container.displayName = 'Container';
