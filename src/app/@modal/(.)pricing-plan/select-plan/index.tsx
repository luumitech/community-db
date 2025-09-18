import { cn } from '@heroui/react';
import React from 'react';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { Link } from '~/view/base/link';
import { FreePlan } from './free-plan';
import { PremiumPlan } from './premium-plan';

interface Props {
  className?: string;
}

export const SelectPlan: React.FC<Props> = ({ className }) => {
  return (
    <div className={className}>
      <div className="grid grid-rows-[repeat(4,_auto)] grid-cols-2 divide-x">
        <FreePlan />
        <PremiumPlan />
      </div>
      <div className="flex items-center justify-center mt-4">
        <p>
          Need more capabilities?{' '}
          <Link
            href={appPath('contactUs', {
              query: {
                title: 'Contact Our Team',
                subject: 'Request information about plan pricing',
                messageDescription: `Specify additional requirement, for example:
                - number of community database required
                - number of addresses required`,
              },
            })}
          >
            Contact our team <Icon className="mx-1" icon="email" />
          </Link>
        </p>
      </div>
    </div>
  );
};
