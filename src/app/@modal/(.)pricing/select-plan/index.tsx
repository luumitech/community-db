import { Link } from '@nextui-org/link';
import clsx from 'clsx';
import queryString from 'query-string';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { FreePlan } from './free-plan';
import { PremiumPlan } from './premium-plan';
import styles from './styles.module.css';

interface Props {
  className?: string;
}

export const SelectPlan: React.FC<Props> = ({ className }) => {
  const contactInfo = queryString.stringifyUrl({
    url: `mailto:${process.env.NEXT_PUBLIC_CONTACT_INFO}`,
    query: {
      subject: 'Need more capability',
      body: 'Please list your specific needs:\n',
    },
  });

  return (
    <div className={className}>
      <div className="grid grid-cols-2 gap-4 items-start p-2">
        <FreePlan className={styles['item-with-border']} />
        <PremiumPlan />
      </div>
      <div className="flex items-center justify-center mt-4">
        <p>
          Need more capabilities?{' '}
          <Link
            href={contactInfo}
            isBlock
            showAnchorIcon
            anchorIcon={<Icon className="mx-1" icon="email" />}
          >
            Contact our team
          </Link>
        </p>
      </div>
    </div>
  );
};
