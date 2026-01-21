'use client';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { LargeMenu } from './large-menu';
import { SmallMenu } from './small-menu';

interface Props {
  className?: string;
}

export const GuideMenu: React.FC<Props> = ({ className }) => {
  const { isSmDevice } = useAppContext();

  return isSmDevice ? <SmallMenu /> : <LargeMenu />;
};
