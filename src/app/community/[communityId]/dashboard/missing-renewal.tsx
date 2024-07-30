import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type DashboardEntry } from './yearly-chart/_type';

// const MissingRenewalFragment = graphql(/* GraphQL */ `
//   fragment Dashboard_MissingRenewal on Community {
//     communityStat {
//       minYear
//       maxYear
//       propertyStat(year: $year) {
//         year
//         joinEvent
//         otherEvents
//         renew
//       }
//     }
//   }
// `);

interface Props {
  className?: string;
  // fragment: DashboardEntry;
}

export const MissingRenewal: React.FC<Props> = ({ className }) => {
  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">
            Members who have not renewed their membership
          </p>
        </div>
      </CardHeader>
      <CardBody>content</CardBody>
    </Card>
  );
};
