import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { Card } from '~/view/base/card';
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
        <Card.Header className="gap-2">
          <YearSelect yearRange={[minYear, maxYear]} />
        </Card.Header>
        <Card.Body className="gap-2">
          <EventInfoEditor />
        </Card.Body>
      </Card>
    </div>
  );
};
