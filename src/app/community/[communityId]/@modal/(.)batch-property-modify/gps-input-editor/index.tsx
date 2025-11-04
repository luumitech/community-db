import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Input } from '~/view/base/input';

interface Props {
  className?: string;
}

export const GpsInputEditor: React.FC<Props> = ({ className }) => {
  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      <p>
        Provide additional details to help find GPS location for properties:
      </p>
      <Input
        classNames={{
          base: 'px-4 min-w-16',
        }}
        controlName="gps.city"
        label="City"
      />
      <Input
        classNames={{
          base: 'px-4 min-w-16',
        }}
        controlName="gps.province"
        label="Province"
      />
      <Input
        classNames={{
          base: 'px-4 min-w-16',
        }}
        controlName="gps.country"
        label="Country"
      />
    </div>
  );
};
