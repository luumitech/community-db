import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureEvents,
  renderEmptyResult,
  renderSections,
} from '~/community/[communityId]/layout-util/render-select';
import { createSelect } from '~/view/base/select';
import { type InputData } from '../../use-hook-form';

const Select = createSelect<InputData>();

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { communityId, selectEventSections } = useLayoutContext();

  const hasNoItem = selectEventSections.length === 0;

  return (
    <Select
      className={twMerge('max-w-sm min-w-32', className)}
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
