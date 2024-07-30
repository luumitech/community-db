'use client';
import React from 'react';
import { getCurrentYear } from '~/lib/date-util';
import { MemberCountChart } from './member-count-chart';
import { MissingRenewal } from './missing-renewal';
import { YearlyChart } from './yearly-chart';

interface Params {
  communityId: string;
}

interface RouteArgs {
  params: Params;
}

export default function Dashboard({ params }: RouteArgs) {
  const { communityId } = params;
  const [selectedYear, setSelectedYear] =
    React.useState<number>(getCurrentYear());

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <MemberCountChart
        // Top chart always occupy first row
        className="col-span-full"
        communityId={communityId}
        onDataClick={(datum) => setSelectedYear(datum.year)}
      />
      {selectedYear && (
        <YearlyChart communityId={communityId} year={selectedYear} />
      )}
      <MissingRenewal className="col-span-full" />
    </div>
  );
}
