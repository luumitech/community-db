import { Card, CardBody, CardHeader, Spacer } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  planName: React.ReactNode;
  price: string;
  button?: React.ReactNode;
}

export const PricePlan: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  planName,
  price,
  button,
  children,
}) => {
  return (
    <Card className={className} shadow="none">
      <CardHeader>
        <div>
          <div className="text-xl font-bold">{planName}</div>
          <div className="flex items-end">
            <span className="text-xl text-foreground-500 self-start">$</span>
            <span className="text-5xl">{price}</span>
            <Spacer y={1} />
            <span className="text-xs leading-[0.9rem] text-foreground-500 mb-1">
              <p>CAD/</p>
              <p>month</p>
            </span>
          </div>
        </div>
      </CardHeader>
      {(!!button || !!children) && (
        <CardBody>
          {button}
          {!!button && <Spacer y={4} />}
          {children}
        </CardBody>
      )}
    </Card>
  );
};
