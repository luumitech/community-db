import React from 'react';
import { createPortal } from 'react-dom';
import { useGridStackWrapperContext } from './gs-wrapper-context';

export const GridStackHeader: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { headerNode } = useGridStackWrapperContext();

  if (!children) {
    return null;
  }
  return createPortal(children, headerNode);
};
