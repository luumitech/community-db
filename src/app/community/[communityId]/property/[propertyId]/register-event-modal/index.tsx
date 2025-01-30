import { useMutation } from '@apollo/client';
import React from 'react';
import * as R from 'remeda';
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
): GQL.PropertyModifyInput {
  // Transfer existing membership information to `GQL.PropertyModifyInput`
  const membershipList = property.membershipList.map<GQL.MembershipInput>(
    (membershipEntry) => ({
      year: membershipEntry.year,
      price: membershipEntry.price,
      paymentMethod: membershipEntry.paymentMethod,
      eventAttendedList: membershipEntry.eventAttendedList.map((eventEntry) => {
        return {
          eventName: eventEntry.eventName,
          eventDate: parseAsDate(eventEntry.eventDate)?.toAbsoluteString(),
          ticketList: eventEntry.ticketList.map(
            ({ __typename, ...ticketEntry }) => ({ ...ticketEntry })
          ),
        };
      }),
    })
  );

  const { self, notes, event, membership } = input;
  /**
   * `membershipList` should be sorted by year in descending order Look for the
   * appropriate index to insert the new membership
   */
  const membershipIdx = R.sortedIndexWith(
    membershipList,
    ({ year }) => year > membership.year
  );
  let membershipFound = membershipList[membershipIdx];
  // If existing membership is found, then update it in place, otherwise insert
  // the `membership` into the `membershipList`
  if (membershipFound?.year !== membership.year) {
    membershipList.splice(membershipIdx, 0, membership);
    membershipFound = membership;
  }

  // Update membership entry
  membershipFound.price = membership.price;
  membershipFound.paymentMethod = membership.paymentMethod;
  const eventFound = (membershipFound.eventAttendedList ?? []).find(
    (eventEntry) => eventEntry.eventName === event.eventName
  );
  if (!eventFound) {
    if (!membershipFound.eventAttendedList) {
      membershipFound.eventAttendedList = [];
    }
    membershipFound.eventAttendedList.push(event);
  } else {
    // Update event details
    eventFound.eventDate = event.eventDate;
    eventFound.ticketList = [
      ...(eventFound.ticketList ?? []),
      ...event.ticketList,
    ];
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
      await toast.promise(
        updateProperty({ variables: { input: propertyInput } }),
        {
          pending: 'Saving...',
          // success: 'Saved',
        }
      );
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
