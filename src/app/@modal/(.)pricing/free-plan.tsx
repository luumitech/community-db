import { Button, Card, CardBody, CardHeader, Spacer } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
}

export const FreePlan: React.FC<Props> = ({ className }) => {
  return (
    <Card className={className} shadow="none">
      <CardHeader>
        <div>
          <p className="font-bold">Free Plan</p>
          <p className="text-foreground-500">CAD $0/month</p>
        </div>
      </CardHeader>
      <CardBody>
        <Button>Your current plan</Button>
        <Spacer y={4} />
        <ul className="list-disc pl-4">
          <li>One database</li>
          <li>Up to 10 addresses per database</li>
        </ul>
      </CardBody>
    </Card>
  );
};
