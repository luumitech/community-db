import { cn } from '@heroui/react';
import React from 'react';
import { GridStackWithCard } from '~/view/base/grid-stack-with-card';
import { usePageContext } from './page-context';
import { useWidgetDefinition } from './widget-definition';

interface Props {
  className?: string;
}

export const PageContent: React.FC<Props> = ({ className }) => {
  const { communityId } = usePageContext();
  const widgets = useWidgetDefinition(communityId);

  return <GridStackWithCard id="membership" widgets={widgets} />;
};
