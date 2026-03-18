import { cn } from '@heroui/react';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { insertIf } from '~/lib/insert-if';
import { defineWidget, type WidgetDefinition } from '~/view/base/grid-stack';
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

export function useWidgetDefinition() {
  const { yearSelected } = useSelector((state) => state.ui);

  /**
   * List of allowable widgets to render in dashboard
   *
   * - Also specifies their default layout positions
   */
  const widgetList = React.useMemo(
    () => ({
      memberCount: {
        name: 'Total Membership Count',
        ...defineWidget({
          id: 'memberCount',
          component: MemberCountChart,
          props: {
            className: cn('h-full w-full'),
          },
          w: 12,
          h: 12,
        }),
      },
      membershipSource: {
        name: 'Membership Source',
        ...defineWidget({
          id: 'membershipSource',
          component: MembershipSource,
          props: {
            className: cn('h-full w-full'),
          },
          w: 6,
          h: 10,
        }),
      },
      membershipFee: {
        name: 'Membership Fee',
        ...defineWidget({
          id: 'membershipFee',
          component: MembershipFee,
          props: {
            className: cn('h-full w-full'),
          },
          w: 6,
          h: 10,
        }),
      },
      eventParticipation: {
        name: 'Event Participation',
        ...defineWidget({
          id: 'eventParticipation',
          component: EventParticipation,
          props: {
            className: cn('h-full w-full'),
          },
          w: 6,
          h: 10,
        }),
      },
      byEvent: {
        name: 'Event Details',
        ...defineWidget({
          id: 'byEvent',
          component: ByEvent,
          props: {
            className: cn('h-full w-full'),
          },
          w: 6,
          h: 10,
        }),
      },
    }),
    []
  );

  /** Default sets of widgets to render on dashboard */
  const widgets = React.useMemo<WidgetDefinition<WidgetId>[]>(
    () => [
      widgetList.memberCount,
      ...insertIf<WidgetDefinition<WidgetId>>(
        yearSelected != null,
        widgetList.membershipSource,
        widgetList.membershipFee,
        widgetList.eventParticipation,
        widgetList.byEvent
      ),
    ],
    [yearSelected, widgetList]
  );

  return { widgets, widgetList };
}
