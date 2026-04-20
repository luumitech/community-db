import { Card, CardBody, CardHeader, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { EventParticipationChart } from './event-participation-chart';

interface Props {
  className?: string;
}

export const EventParticipation: React.FC<Props> = ({ className }) => {
  const { year, isLoading } = usePageContext();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-md font-bold">{`${year} ${allowableWidgets.eventParticipation.info.label}`}</p>
        </div>
      </CardHeader>
      <CardBody className="overflow-hidden">
        <Skeleton
          classNames={{
            base: 'rounded-lg h-full',
            content: 'h-full',
          }}
          aria-label="skeleton"
          isLoaded={!isLoading}
        >
          <EventParticipationChart />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
