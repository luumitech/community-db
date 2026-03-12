'use client';
import { Card, CardBody } from '@heroui/react';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import {
  GridStackProvider,
  GridStackRender,
  defineWidget,
} from '~/view/base/grid-stack';
import { MemberCountChart } from './member-count-chart';

import styles from './styles.module.css';

// --- Types ---
interface StatsWidgetProps {
  title: string;
  value: string;
  trend: number;
  onInputChange?: (value: string) => void;
}

// --- Widget Components ---
const StatsWidget = ({
  title,
  value,
  trend,
  onInputChange,
}: StatsWidgetProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange?.(e.target.value);
  };

  return (
    <Card className="h-full w-full">
      <CardBody>
        <span className="text-sm text-gray-500">{title}</span>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p
            className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </p>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter a note..."
          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:outline-none"
        />
      </CardBody>
    </Card>
  );
};

// --- Dashboard ---
interface Props {
  communityId: string;
}

export const CustomGrid: React.FC<Props> = ({ communityId }) => {
  const [revenueNote, setRevenueNote] = React.useState('');
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
        id: 'revenue',
        x: 0,
        y: 0,
        w: 3,
        h: 2,
        component: StatsWidget,
        props: {
          title: 'Revenue',
          value: '$12,400',
          trend: 8.2,
          onInputChange: (val: string) => setRevenueNote(val),
        },
      }),
      defineWidget({
        id: 'users',
        x: 3,
        y: 0,
        w: 3,
        h: 2,
        component: StatsWidget,
        props: { title: 'Active Users', value: '3,210', trend: -2.1 },
      }),
      defineWidget({
        id: 'member-count',
        x: 3,
        y: 0,
        w: 12,
        h: 6,
        component: MemberCountChart,
        props: {
          communityId: communityId,
          selectedYear: yearSelected,
          onYearSelect,
        },
      }),
    ],
    [communityId, yearSelected, onYearSelect]
  );

  return (
    <div className={styles.gridWrapper}>
      <GridStackProvider
        initialOptions={{
          // cellHeight: 100,
          margin: 8,
          columnOpts: {
            breakpoints: [
              { w: 768, c: 6 },
              { w: 480, c: 2 },
            ],
          },
        }}
        widgets={widgets}
      >
        <GridStackRender />
      </GridStackProvider>
    </div>
  );
};
