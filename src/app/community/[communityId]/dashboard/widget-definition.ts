import { cn } from '@heroui/react';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { insertIf } from '~/lib/insert-if';
import { defineWidget } from '~/view/base/grid-stack';
import { MemberCountChart } from './member-count-chart';
import {
  ByEvent,
  EventParticipation,
  MembershipFee,
  MembershipSource,
} from './yearly-chart';

export function useWidgetDefinition(communityId: string) {
  const dispatch = useDispatch();
  const { yearSelected } = useSelector((state) => state.ui);

  const onYearSelect = React.useCallback(
    (year: number) => {
      dispatch(actions.ui.setYearSelected(year));
    },
    [dispatch]
  );

  const widgets = React.useMemo(
    () => [
      defineWidget({
        id: 'member-count',
        w: 12,
        h: 12,
        component: MemberCountChart,
        props: {
          className: cn('h-full w-full'),
          communityId: communityId,
          selectedYear: yearSelected,
          onYearSelect,
        },
      }),
      ...insertIf(
        yearSelected != null,
        defineWidget({
          id: 'membership-source',
          w: 6,
          h: 10,
          component: MembershipSource,
          props: {
            className: cn('h-full w-full'),
          },
        }),
        defineWidget({
          id: 'membership-fee',
          w: 6,
          h: 10,
          component: MembershipFee,
          props: {
            className: cn('h-full w-full'),
          },
        }),
        defineWidget({
          id: 'event-participation',
          w: 6,
          h: 10,
          component: EventParticipation,
          props: {
            className: cn('h-full w-full'),
          },
        }),
        defineWidget({
          id: 'by-event',
          w: 6,
          h: 10,
          component: ByEvent,
          props: {
            className: cn('h-full w-full'),
          },
        })
      ),
    ],
    [communityId, yearSelected, onYearSelect]
  );

  return widgets;
}
