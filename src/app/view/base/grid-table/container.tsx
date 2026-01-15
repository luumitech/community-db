import React from 'react';
import { twMerge } from 'tailwind-merge';
import { CLASS_DEFAULT } from './_config';
import type { CommonProps } from './_type';

interface Props extends CommonProps {}

/**
 * Table container
 *
 * Defines the grid container, and the grid layout
 *
 * - By default, there are 8 equal columns
 */
export const Container: React.FC<React.PropsWithChildren<Props>> = ({
  config,
  columnKeys,
  columnConfig,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'grid',
        CLASS_DEFAULT.gridContainer,
        config?.gridContainer
      )}
      {...props}
    />
  );
};
