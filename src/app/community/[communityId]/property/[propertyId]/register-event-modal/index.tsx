import { useMutation } from '@apollo/client';
import React from 'react';
import { FormProvider } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { parseAsDate } from '~/lib/date-util';
import { toast } from '~/view/base/toastify';
import { PropertyMutation } from '../membership-editor-modal';
import { usePageContext } from '../page-context';
import { ModalDialog } from './modal-dialog';
import { type InputData } from './use-hook-form';

export { useHookFormWithDisclosure } from './use-hook-form';
export type { UseHookFormWithDisclosureResult } from './use-hook-form';

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
          ticketList: eventEntry.ticketList,
        };
      }),
    }));

  const { self, notes, event, membership } = input;
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
    eventFound.ticketList = event.ticketList;
  }

  return {
    self,
    notes,
    membershipList,
  };
}

interface Props {
  className?: string;
}

export const RegisterEventModal: React.FC<Props> = ({ className }) => {
  const [updateProperty] = useMutation(PropertyMutation);
  const { registerEvent } = usePageContext();
  const { formMethods, property } = registerEvent;

  const onSave = React.useCallback(
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
    <div className={className}>
      <FormProvider {...formMethods}>
        <ModalDialog onSave={onSave} />
      </FormProvider>
    </div>
  );
};
