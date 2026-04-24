import React from 'react';
import { createPortal } from 'react-dom';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props {}

export const HeaderMenuWrapper: React.FC<React.PropsWithChildren<Props>> = ({
  children,
}) => {
  const { moreMenuAnchor } = useAppContext();

  if (!moreMenuAnchor) {
    return null;
  }

  return createPortal(children, moreMenuAnchor, 'header-more-menu');
};
