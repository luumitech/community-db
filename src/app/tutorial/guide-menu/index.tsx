'use client';
import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { LargeMenu } from './large-menu';
import { SmallMenu } from './small-menu';

interface Props {
  className?: string;
}

export const GuideMenu: React.FC<Props> = ({ className }) => {
  const isSmallDevice = useMediaQuery('(max-width: 768px)');

  return isSmallDevice ? <SmallMenu /> : <LargeMenu />;
};
