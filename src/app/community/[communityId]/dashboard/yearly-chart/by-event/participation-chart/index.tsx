import { Card, CardHeader } from '@heroui/react';
import React from 'react';
import { type MemberSourceStat } from '../_type';
import { MemberCount } from './member-count';
import { NoMember } from './no-member';

interface Props {
  className?: string;
  stat: MemberSourceStat;
}

export const ParticipationChart: React.FC<Props> = ({ className, stat }) => {
  const noMember = React.useMemo(() => {
    const eventStat = stat[0];
    return eventStat.existing + eventStat.new + eventStat.renew === 0;
  }, [stat]);

  return (
    <Card shadow="sm">
      <CardHeader className="font-semibold">Member Count</CardHeader>
      {noMember ? <NoMember /> : <MemberCount stat={stat} />}
    </Card>
  );
};
