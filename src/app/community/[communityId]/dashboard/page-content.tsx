import React from 'react';
import { useSet } from 'react-use';
import {
  GridStackWithCard,
  useLocalStorageLayout,
  type OnSizeChangeFn,
} from '~/view/base/grid-stack-with-card';
import { Demo } from '~/view/base/grid-stack/demo';
import { ConfigDrawer } from './config-drawer';
import {
  useWidgetDefinition,
  widgetIdList,
  type WidgetId,
} from './widget-definition';

const DASHBOARD_ID = 'dashboard';

interface Props {
  className?: string;
}

export const PageContent: React.FC<Props> = ({ className }) => {
  const [bkCols, setBkCols] = React.useState<number>(12);
  const { getLayout } = useLocalStorageLayout(DASHBOARD_ID);
  const layout = getLayout(bkCols);
  const { widgets, addWidget, removeWidget, setWidgets } =
    useWidgetDefinition(layout);

  const onSizeChange: OnSizeChangeFn = React.useCallback((grid, cols) => {
    setBkCols(cols);
  }, []);

  const widgetIdsShown = widgets.map(({ id }) => id);

  return (
    // <Demo />
    <GridStackWithCard
      id={DASHBOARD_ID}
      widgets={widgets}
      onSizeChange={onSizeChange}
      onRemove={(id) => removeWidget(id as WidgetId)}
    >
      <ConfigDrawer widgetIdsShown={widgetIdsShown} setWidgets={setWidgets} />
    </GridStackWithCard>
  );
};
