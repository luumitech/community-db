import React from 'react';
import * as R from 'remeda';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT, COMMON_PROPS } from './_config';
import type { CommonProps } from './_type';

type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface Props<ColumnKey extends Readonly<string>>
  extends CommonProps<ColumnKey>, DivProps {
  className?: string;
}

/**
 * Table container
 *
 * Defines the grid container, and the grid layout
 *
 * - By default, there are 8 equal columns
 */
export function Container<ColumnKey extends Readonly<string>>(
  props: Props<ColumnKey>
) {
  const ContainerImpl = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<Props<ColumnKey>>
  >((_, ref) => {
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

  ContainerImpl.displayName = 'Container';
  return <ContainerImpl {...props} />;
}
