import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { EventsAttendedSelect } from './events-attended-select';
import { PaymentInfoEditor } from './payment-info-editor';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const MembershipInfoEditor: React.FC<Props> = ({ className }) => {
  const { communityUi, minYear, maxYear } = useAppContext();

  return (
    <div className={clsx(className)}>
      <Card>
        <CardHeader className="gap-2">
          <YearSelect yearRange={[minYear, maxYear]} />
        </CardHeader>
        <CardBody>
          <PaymentInfoEditor className="pb-4" />
          <EventsAttendedSelect />
        </CardBody>
      </Card>
    </div>
  );
};
