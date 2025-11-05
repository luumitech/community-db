'use client';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import { MoreMenu } from '../common/more-menu';
import { MemberCountChart } from './member-count-chart';
import { YearlyChart } from './yearly-chart';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Promise<Params>;
}

export default function Dashboard(props: RouteArgs) {
  const params = React.use(props.params);
  const { communityId } = params;
  const dispatch = useDispatch();
  const { yearSelected } = useSelector((state) => state.ui);

  return (
    <div className="mt-page-top">
      <MoreMenu omitKeys={['communityDashboard']} />
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <MemberCountChart
          // Top chart always occupy first row
          className="col-span-full"
          communityId={communityId}
          selectedYear={yearSelected}
          onYearSelect={(year) => dispatch(actions.ui.setYearSelected(year))}
        />
        {yearSelected != null && (
          <YearlyChart communityId={communityId} year={yearSelected} />
        )}
      </div>
    </div>
  );
}
