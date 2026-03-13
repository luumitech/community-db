'use client';
import React from 'react';
import { GridStackWithCard } from '~/view/base/grid-stack-with-card';
import { useWidgetDefinition } from './widget-definition';
import { YearlyProvider } from './yearly-context';

import styles from '../styles.module.css';

interface Props {
  className?: string;
  communityId: string;
  year: number;
}

export const YearlyChart: React.FC<Props> = ({
  className,
  communityId,
  year,
}) => {
  const widgets = useWidgetDefinition();

  return (
    <YearlyProvider communityId={communityId} year={year}>
      <GridStackWithCard widgets={widgets} />
    </YearlyProvider>
  );
};
