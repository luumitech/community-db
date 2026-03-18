import React from 'react';
import { GridStackWithCard } from '~/view/base/grid-stack-with-card';
import { ConfigDrawer } from './config-drawer';
import { type InputData } from './config-drawer/use-hook-form';
import { useWidgetDefinition } from './widget-definition';

interface Props {
  className?: string;
}

export const PageContent: React.FC<Props> = ({ className }) => {
  const { widgets } = useWidgetDefinition();

  const onSaveLayout = React.useCallback(async (input: InputData) => {
    //TODO:
    // console.log({ input });
  }, []);

  return (
    <GridStackWithCard id="dashboard" widgets={widgets}>
      <ConfigDrawer onSave={onSaveLayout} />
    </GridStackWithCard>
  );
};
