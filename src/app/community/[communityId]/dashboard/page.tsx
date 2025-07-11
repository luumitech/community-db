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
  params: Params;
}

export default function Dashboard({ params }: RouteArgs) {
  const { communityId } = params;
  const dispatch = useDispatch();
  const { yearSelected } = useSelector((state) => state.ui);

  return (
    <>
      <MoreMenu omitKeys={['communityDashboard']} />
      <div className="grid md:grid-cols-2 gap-4 mb-4">
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
    </>
  );
}
