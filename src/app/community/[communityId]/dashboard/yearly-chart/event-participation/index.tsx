import { Card, CardBody, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { EventParticipationChart } from './event-participation-chart';

const Title: React.FC = () => {
  const { year } = usePageContext();
  return (
    <WidgetTitle>{`${year} ${allowableWidgets.eventParticipation.info.label}`}</WidgetTitle>
  );
};

interface Props {
  className?: string;
}

const Chart: React.FC<Props> = ({ className }) => {
  const { year, isLoading } = usePageContext();

  return (
    <Card className={cn(className)}>
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

export const EventParticipation = {
  Chart,
  Title,
};
