import { GridStack as GS } from 'gridstack';
import React from 'react';
import * as R from 'remeda';
import { useSelector } from '~/custom-hooks/redux';
import {
  defineWidget,
  type GridStackWidget,
  type Widget,
} from '~/view/base/grid-stack';
import { MemberCountChart } from './member-count-chart';
import {
  ByEvent,
  EventParticipation,
  MembershipFee,
  MembershipSource,
} from './yearly-chart';

/** Allowable widgets that can be rendered in dashboard */
export const widgetIdList = [
  'memberCount',
  'membershipSource',
  'membershipFee',
  'eventParticipation',
  'byEvent',
] as const;

export type WidgetId = (typeof widgetIdList)[number];

export const widgetName: Record<WidgetId, string> = {
  memberCount: 'Total Membership Count',
  membershipSource: 'Membership Source',
  membershipFee: 'Membership Fee',
  eventParticipation: 'Event Participation',
  byEvent: 'Event Details',
};

/** Helper utility to make every field optional except 'id' */
type WithRequiredId<T extends { id: unknown }> = Pick<T, 'id'> &
  Partial<Omit<T, 'id'>>;
type WidgetMap = Partial<Record<WidgetId, Widget<WidgetId>>>;
type PartialWidgetMap = Partial<
  Record<WidgetId, WithRequiredId<Widget<WidgetId>>>
>;

/**
 * Convert the widget definition stored in GridStack layout (i.e. localstorage)
 * into widgetMap format, to make it easier to manage the widgets we want to
 * render
 */
function layoutToWidgetMap(
  layout?: GridStackWidget[]
): PartialWidgetMap | null {
  const result: PartialWidgetMap = {};
  if (layout == null) {
    return null;
  }
  (layout as WithRequiredId<Widget<WidgetId>>[]).map((widget) => {
    result[widget.id] = widget;
  });
  return result;
}

export function useWidgetDefinition(_layout?: GridStackWidget[]) {
  const { yearSelected } = useSelector((state) => state.ui);
  const [layout, setLayout] = React.useState(layoutToWidgetMap(_layout));

  /**
   * List of allowable widgets to render in dashboard
   *
   * - Also specifies their default layout positions
   */
  const allWidgets = React.useMemo<WidgetMap>(() => {
    return {
      memberCount: defineWidget({
        id: 'memberCount',
        w: 12,
        h: 12,
        content: <MemberCountChart className="h-full w-full" />,
      }),
      ...(yearSelected != null && {
        membershipSource: defineWidget({
          id: 'membershipSource',
          w: 6,
          h: 10,
          content: <MembershipSource className="h-full w-full" />,
        }),
        membershipFee: defineWidget({
          id: 'membershipFee',
          w: 6,
          h: 10,
          content: <MembershipFee className="h-full w-full" />,
        }),
        eventParticipation: defineWidget({
          id: 'eventParticipation',
          w: 6,
          h: 10,
          content: <EventParticipation className="h-full w-full" />,
        }),
        byEvent: defineWidget({
          id: 'byEvent',
          w: 6,
          h: 10,
          content: <ByEvent className="h-full w-full" />,
        }),
      }),
    };
  }, [yearSelected]);

  /** Add a widget */
  const addWidget = React.useCallback(
    (id: WidgetId) => {
      setLayout((prev) => {
        const newWidget: PartialWidgetMap = { [id]: { id } };
        return { ...prev, ...newWidget };
      });
    },
    [setLayout]
  );

  /** Remove a widget */
  const removeWidget = React.useCallback(
    (id: WidgetId) => {
      setLayout((prev) => {
        if (prev == null) {
          return null;
        }
        const { [id]: _, ...rest } = prev;
        return rest;
      });
    },
    [setLayout]
  );

  /** Set a list of widgets to display */
  const setWidgets = React.useCallback(
    (idList: WidgetId[]) => {
      setLayout(() => {
        const widgetList = R.mapToObj(idList, (id) => [id, { id }]);
        return widgetList;
      });
    },
    [setLayout]
  );

  /**
   * Combine default widget information (in allWidgets), and the information
   * stored in layout to produce list of widgets to show
   */
  const widgets = React.useMemo<Widget<WidgetId>[]>(() => {
    if (layout == null) {
      return Object.values(allWidgets);
    }
    return Object.entries(layout).map(([id, entry]) => {
      return {
        ...allWidgets[id as WidgetId],
        ...entry,
      } as Widget<WidgetId>;
    });
  }, [layout, allWidgets]);

  return {
    widgets,
    addWidget,
    removeWidget,
    setWidgets,
  };
}
