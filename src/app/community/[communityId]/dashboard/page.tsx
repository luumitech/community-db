'use client';
import React from 'react';
import { MoreMenu } from '../more-menu';
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
  const [selectedYear, setSelectedYear] = React.useState<number>();

  return (
    <>
      {/* <MoreMenu communityId={communityId} /> */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <MemberCountChart
          // Top chart always occupy first row
          className="col-span-full"
          communityId={communityId}
          onYearSelect={setSelectedYear}
        />
        {selectedYear && (
          <>
            <YearlyChart communityId={communityId} year={selectedYear} />
          </>
        )}
      </div>
    </>
  );
}
