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
      Specify new event to add:
      <Card className="mt-2">
        <CardHeader className="gap-2">
          <YearSelect yearRange={[minYear, maxYear]} />
        </CardHeader>
        <CardBody className="gap-2">
          <PaymentInfoEditor />
          <EventsAttendedSelect />
        </CardBody>
      </Card>
    </div>
  );
};
