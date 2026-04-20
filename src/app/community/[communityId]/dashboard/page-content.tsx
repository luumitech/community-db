import React from 'react';
import {
  GridStackWithCard,
  type WidgetFilterFn,
} from '~/view/base/grid-stack-with-card';
import { Demo } from '~/view/base/grid-stack/demo';
import { usePageContext } from './page-context';
import { allowableWidgets, type WidgetId } from './widget-definition';

interface Props {
  className?: string;
}

export const PageContent: React.FC<Props> = ({ className }) => {
  const { year } = usePageContext();

  const widgetFilter = React.useCallback<WidgetFilterFn<WidgetId>>(
    (widget) => {
      switch (widget.id) {
        case 'memberCount':
          return true;
        case 'membershipSource':
        case 'membershipFee':
        case 'eventParticipation':
        case 'byEvent':
        case 'byTicket':
          return year != null;
        default:
          throw new Error(`Unrecognized widget ID: ${widget.id}`);
      }
    },
    [year]
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
    />
  );
};
