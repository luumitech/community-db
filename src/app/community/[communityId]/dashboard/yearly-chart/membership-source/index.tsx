import { Skeleton, cn } from '@heroui/react';
import React from 'react';
import { Card } from '~/view/base/card';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { MembershipSourceChart } from './membership-source-chart';

const Title: React.FC = () => {
  const { year } = usePageContext();
  return (
    <WidgetTitle>{`${year} ${allowableWidgets.membershipSource.info.label}`}</WidgetTitle>
  );
};

interface Props {
  className?: string;
}

const Chart: React.FC<Props> = ({ className }) => {
  const { year, isLoading } = usePageContext();

  return (
    <Card className={cn(className)}>
      <Card.Body className="overflow-hidden">
        <Skeleton
          classNames={{
            base: 'rounded-lg h-full',
            content: 'h-full',
          }}
          aria-label="skeleton"
          isLoaded={!isLoading}
        >
          <MembershipSourceChart />
        </Skeleton>
      </Card.Body>
    </Card>
  );
};

export const MembershipSource = {
  Chart,
  Title,
};
