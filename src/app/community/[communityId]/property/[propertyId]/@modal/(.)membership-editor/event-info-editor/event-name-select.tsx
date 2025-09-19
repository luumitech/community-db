import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureEvents,
  renderEmptyResult,
  renderSections,
} from '~/community/[communityId]/layout-util/render-select';
import { Select, SelectProps } from '~/view/base/select';
import { useHookFormContext } from '../use-hook-form';

interface Props {
  className?: string;
  yearIdx: number;
  eventIdx: number;
}

export const EventNameSelect: React.FC<Props> = ({
  className,
  yearIdx,
  eventIdx,
}) => {
  const { communityId, selectEventSections } = useLayoutContext();
  const { clearErrors } = useHookFormContext();

  const onSelectionChange: NonNullable<SelectProps['onSelectionChange']> =
    React.useCallback(
      (keys) => {
        /**
         * This is needed because errors like duplicate event names are not
         * cleared automatically after selection is changed
         */
        clearErrors(`membershipList.${yearIdx}.eventAttendedList`);
      },
      [clearErrors, yearIdx]
    );

  const hasNoItem = selectEventSections.length === 0;

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      controlName={`membershipList.${yearIdx}.eventAttendedList.${eventIdx}.eventName`}
      aria-label="Event Name"
      variant="underlined"
      // placeholder="Select an event"
      onSelectionChange={onSelectionChange}
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
