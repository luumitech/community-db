import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import {
  PleaseConfigureEvents,
  renderEmptyResult,
  renderSections,
} from '~/community/[communityId]/layout-util/render-select';
import { SelectProps, createSelect } from '~/view/base/select';
import { useHookFormContext, type InputData } from '../use-hook-form';

const Select = createSelect<InputData>();

interface Props {
  className?: string;
  membershipPrefix: `membershipList.${number}`;
  eventPrefix: `membershipList.${number}.eventAttendedList.${number}`;
}

export const EventNameSelect: React.FC<Props> = ({
  className,
  membershipPrefix,
  eventPrefix,
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
        clearErrors(`${membershipPrefix}.eventAttendedList`);
      },
      [clearErrors, membershipPrefix]
    );

  const hasNoItem = selectEventSections.length === 0;

  return (
    <Select
      className={twMerge('max-w-xs min-w-32', className)}
      controlName={`${eventPrefix}.eventName`}
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
