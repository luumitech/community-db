import { Card, CardBody, CardHeader, Skeleton, cn } from '@heroui/react';
import React from 'react';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { MembershipSourceChart } from './membership-source-chart';

interface Props {
  className?: string;
}

export const MembershipSource: React.FC<Props> = ({ className }) => {
  const { year, isLoading } = usePageContext();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-md font-bold">{`${year} ${allowableWidgets.membershipSource.info.label}`}</p>
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
          <MembershipSourceChart />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
