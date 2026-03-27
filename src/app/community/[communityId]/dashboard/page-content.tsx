import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import {
  GridStackWithCard,
  type WidgetFilterFn,
} from '~/view/base/grid-stack-with-card';
import { Demo } from '~/view/base/grid-stack/demo';
import { ConfigDrawer } from './config-drawer';
import { allowableWidgets, type WidgetId } from './widget-definition';

interface Props {
  className?: string;
}

export const PageContent: React.FC<Props> = ({ className }) => {
  const { yearSelected } = useSelector((state) => state.ui);

  const widgetFilter = React.useCallback<WidgetFilterFn<WidgetId>>(
    (widget) => {
      switch (widget.id) {
        case 'memberCount':
          return true;
        case 'membershipSource':
        case 'membershipFee':
        case 'eventParticipation':
        case 'byEvent':
          return yearSelected != null;
        default:
          throw new Error(`Unrecognized widget ID: ${widget.id}`);
      }
    },
    [yearSelected]
  );

  // Kept for debugging purpose
  // return <Demo />;

  return (
    <GridStackWithCard
      lsSuffix="dashboard"
      allowableWidgets={allowableWidgets}
      widgetFilter={widgetFilter}
      options={{
        margin: 8,
      }}
    >
      <ConfigDrawer />
    </GridStackWithCard>
  );
};
