import { Button, Card, CardBody, CardHeader, Spacer } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { Icon } from '~/view/base/icon';

interface Props {
  className?: string;
}

export const PremiumPlan: React.FC<Props> = ({ className }) => {
  return (
    <Card className={className} shadow="none">
      <CardHeader>
        <div>
          <p className="flex items-center gap-2 font-bold">
            <Icon className="text-yellow-400" icon="premium-plan" size={20} />
            Premium Plan
          </p>
          <p className="text-foreground-500">CAD $5/month</p>
        </div>
      </CardHeader>
      <CardBody>
        <Button>Upgrade to Premium</Button>
        <Spacer y={4} />
        <ul className="list-disc pl-4">
          <li>Up to 5 databases</li>
          <li>Up to 1000 addresses per database</li>
        </ul>
      </CardBody>
    </Card>
  );
};
