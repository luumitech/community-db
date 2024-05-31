import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';

export interface InputData
  extends Pick<GQL.PropertyModifyInput, 'notes' | 'membershipList'> {}
type DefaultData = DefaultInput<InputData>;

export function membershipDefault(
  year: number
): DefaultInput<GQL.MembershipInput> {
  return {
    year,
    isMember: false,
    eventAttendedList: [],
    paymentMethod: '',
    paymentDeposited: false,
  };
}

function defaultInputData(
  item: GQL.PropertyId_MembershipEditorFragment
): DefaultData {
  return {
    notes: item.notes ?? '',
    membershipList: item.membershipList.map((entry) => ({
      year: entry.year,
      isMember: entry.isMember ?? membershipDefault(0).isMember,
      eventAttendedList: entry.eventAttendedList.map((event) => ({
        eventName: event.eventName ?? '',
        eventDate: event.eventDate ?? '',
      })),
      paymentMethod: entry.paymentMethod ?? membershipDefault(0).paymentMethod,
      paymentDeposited:
        entry.paymentDeposited ?? membershipDefault(0).paymentDeposited,
    })),
  };
}

function validationResolver() {
  const schema = yup.object({
    notes: yup.string().nullable(),
    membershipList: yup.array(
      yup.object().shape(
        {
          eventAttendedList: yup
            .array(
              yup.object({
                eventName: yup.string().required('Must specify a value'),
                eventDate: yup
                  .string()
                  .asDate()
                  .required('Must specify a value'),
              })
            )
            .unique('Event Name must be unique', (item) => item.eventName)
            .when('paymentMethod', {
              is: (paymentMethod?: string) => !!paymentMethod,
              then: (_schema) =>
                _schema.min(
                  1,
                  'Must add at least one event when Payment Method is specified'
                ),
            }),
          paymentMethod: yup.string().when('eventAttendedList', {
            is: (eventAttendedList?: GQL.EventInput[]) =>
              !!eventAttendedList?.length,
            then: (_schema) =>
              _schema.required(
                'Must specify a value when event has been added'
              ),
          }),
        },
        // Add dependency to avoid cyclic dependency error,
        // see: https://github.com/jquense/yup/issues/79#issuecomment-274174656
        [['eventAttendedList', 'paymentMethod']]
      )
    ),
  });
  return yupResolver(schema);
}

export function useHookFormWithDisclosure(
  fragment: GQL.PropertyId_MembershipEditorFragment
) {
  const defaultValues = defaultInputData(fragment);
  const formMethods = useForm({
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
