import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureEvents,
  renderEmptyResult,
  renderSections,
} from '~/community/[communityId]/layout-util/render-select';
import { Select } from '~/view/base/select';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { communityId, selectEventSections } = useLayoutContext();

  const hasNoItem = selectEventSections.length === 0;

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-sm')}
      controlName="membership.eventAttended.eventName"
      aria-label="Event Name"
      variant="underlined"
      // placeholder="Select an event"
    >
      <>
        {hasNoItem &&
          renderEmptyResult(
            <PleaseConfigureEvents communityId={communityId} />
          )}
        {renderSections(selectEventSections)}
      </>
    </Select>
  );
};
