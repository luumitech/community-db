'use client';
import React from 'react';
import { useSelector } from '~/custom-hooks/redux';
import { GridStackWithCard } from '~/view/base/grid-stack-with-card';
import { MoreMenu } from '../common/more-menu';
import { useWidgetDefinition } from './widget-definition';
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
  const widgets = useWidgetDefinition(communityId);
  const { yearSelected } = useSelector((state) => state.ui);

  return (
    <div className="mt-page-top">
      <MoreMenu omitKeys={['communityDashboard']} />
      <GridStackWithCard widgets={widgets} />
      {yearSelected != null && (
        <YearlyChart communityId={communityId} year={yearSelected} />
      )}
    </div>
  );
}
