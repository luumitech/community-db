import { Card, CardBody, CardHeader, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { EventInfoEditor } from './event-info-editor';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const MembershipInfoEditor: React.FC<Props> = ({ className }) => {
  const { minYear, maxYear } = useLayoutContext();

  return (
    <div className={cn(className)}>
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
