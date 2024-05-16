import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import * as GQL from '~/graphql/generated/graphql';

export { useFieldArray } from 'react-hook-form';

export interface InputData
  extends Pick<GQL.PropertyModifyInput, 'notes' | 'membershipList'> {}
type DefaultData = DefaultInput<InputData>;

export const membershipDefault: DefaultInput<GQL.MembershipInput> = {
  year: null,
  isMember: false,
  eventAttendedList: [],
  paymentMethod: '',
  paymentDeposited: false,
};

function defaultInputData(
  item: GQL.PropertyId_MembershipEditorFragment
): DefaultData {
  return {
    notes: item.notes ?? '',
    membershipList: item.membershipList.map((entry) => ({
      year: entry.year ?? membershipDefault.year,
      isMember: entry.isMember ?? membershipDefault.isMember,
      eventAttendedList: entry.eventAttendedList.map((event) => ({
        eventName: event.eventName ?? '',
        eventDate: event.eventDate ?? '',
      })),
      paymentMethod: entry.paymentMethod ?? membershipDefault.paymentMethod,
      paymentDeposited:
        entry.paymentDeposited ?? membershipDefault.paymentDeposited,
    })),
  };
}

function validationResolver() {
  const schema = yup.object().shape({
    notes: yup.string().nullable(),
  });
  return yupResolver(schema);
}

export function useHookFormWithDisclosure(
  fragment: GQL.PropertyId_MembershipEditorFragment
) {
  const defaultValues = defaultInputData(fragment);
  const formMethods = useForm<InputData>({
    defaultValues,
    resolver: validationResolver(),
  });
  const { reset } = formMethods;
  /**
   * When modal is closed, reset form value with
   * default values derived from fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
