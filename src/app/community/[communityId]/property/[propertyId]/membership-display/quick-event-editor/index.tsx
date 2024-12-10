import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { parseAsDate } from '~/lib/date-util';
import { toast } from '~/view/base/toastify';
import { PropertyMutation } from '../../membership-editor-modal';
import { EventEditor } from './event-editor';
import { useHookForm, type InputData } from './use-hook-form';

/** Convert hookform inputData to input suitable for `PropertyMutation` */
function createPropertyInput(
  property: GQL.PropertyId_MembershipEditorFragment,
  input: InputData
): GQL.PropertyModifyInput | null {
  const membershipIdx = property.membershipList.findIndex(
    (entry) => entry.year === input.membership.year
  );
  if (membershipIdx === -1) {
    return null;
  }

  // Map existing membership information to `GQL.PropertyModifyInput`
  const membershipList: GQL.PropertyModifyInput['membershipList'] =
    property.membershipList.map((membershipEntry) => ({
      year: membershipEntry.year,
      paymentMethod: membershipEntry.paymentMethod,
      eventAttendedList: membershipEntry.eventAttendedList.map((eventEntry) => {
        return {
          eventName: eventEntry.eventName,
          eventDate: parseAsDate(eventEntry.eventDate)?.toAbsoluteString(),
          ticket: eventEntry.ticket,
        };
      }),
    }));

  const { self, event, membership } = input;
  const membershipFound = membershipList[membershipIdx];
  membershipFound.paymentMethod = membership.paymentMethod;
  const eventFound = (membershipFound.eventAttendedList ?? []).find(
    (eventEntry) => eventEntry.eventName === event.eventName
  );
  if (!eventFound) {
    membershipFound.eventAttendedList?.push(event);
  } else {
    // Update event details
    eventFound.eventDate = event.eventDate;
    eventFound.ticket = event.ticket;
  }

  return {
    self,
    membershipList,
  };
}

interface Props {
  className?: string;
}

/**
 * Main goal is to make it easier to register event without having to go into
 * the 'Edit Membership Info' button
 */
export const QuickEventEditor: React.FC<Props> = ({ className }) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { formMethods, property } = useHookForm();

  const onRegister = React.useCallback(
    async (input: InputData) => {
      const propertyInput = createPropertyInput(property, input);
      if (propertyInput != null) {
        await toast.promise(
          updateProperty({ variables: { input: propertyInput } }),
          {
            pending: 'Saving...',
            success: 'Saved',
          }
        );
      }
    },
    [property, updateProperty]
  );

  return (
    <div className={clsx(className)}>
      <FormProvider {...formMethods}>
        <EventEditor onRegister={onRegister} />
      </FormProvider>
    </div>
  );
};
