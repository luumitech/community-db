import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { PleaseConfigureEvents } from '~/community/[communityId]/layout-util/render-select';
import { createSelect } from '~/view/base/select';
import { type InputData } from '../use-hook-form';

const Select = createSelect<InputData>();

interface Props {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
}

export const EventNameSelect: React.FC<Props> = ({
  className,
  membershipPrefix,
}) => {
  const { communityId, visibleEventItems } = useLayoutContext();

  const emptyContent = React.useMemo(() => {
    return <PleaseConfigureEvents communityId={communityId} />;
  }, [communityId]);

  return (
    <Select
      className={className}
      controlName={`${membershipPrefix}.paymentEventName`}
      label="Payment Event Name"
      items={visibleEventItems}
      emptyContent={emptyContent}
    />
  );
};
