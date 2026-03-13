import { cn } from '@heroui/react';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { defineWidget } from '~/view/base/grid-stack';
import { MemberCountChart } from './member-count-chart';

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
    ],
    [communityId, yearSelected, onYearSelect]
  );

  return widgets;
}
