import { Card, CardBody, CardHeader } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { EventInfoEditor } from './event-info-editor';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const MembershipInfoEditor: React.FC<Props> = ({ className }) => {
  const { minYear, maxYear } = useAppContext();

  return (
    <div className={clsx(className)}>
      Specify new event to add:
      <Card className="mt-2">
        <CardHeader className="gap-2">
          <YearSelect yearRange={[minYear, maxYear]} />
        </CardHeader>
        <CardBody className="gap-2">
          <EventInfoEditor />
        </CardBody>
      </Card>
    </div>
  );
};
