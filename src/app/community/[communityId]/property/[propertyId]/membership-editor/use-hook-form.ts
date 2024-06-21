import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { graphql, useFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { type PropertyEntry } from '../_type';

const MembershipEditorFragment = graphql(/* GraphQL */ `
  fragment PropertyId_MembershipEditor on Property {
    id
    updatedAt
    updatedBy {
      ...User
    }
    notes
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
        eventDate
      }
      paymentMethod
      paymentDeposited
    }
  }
`);

function schema() {
  return yup.object({
    self: yup.object({
      id: yup.string().required(),
      updatedAt: yup.string().required(),
    }),
    notes: yup.string().nullable(),
    membershipList: yup.array(
      yup.object().shape(
        {
          year: yup.number().required(),
          isMember: yup.boolean(),
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
          paymentDeposited: yup.boolean(),
        },
        [
          // Add dependency to avoid cyclic dependency error,
          // see: https://github.com/jquense/yup/issues/79#issuecomment-274174656
          ['eventAttendedList', 'paymentMethod'],
        ]
      )
    ),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
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

function defaultInputData(fragment: PropertyEntry): DefaultData {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const item = useFragment(MembershipEditorFragment, fragment);

  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
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

export function useHookFormWithDisclosure(fragment: PropertyEntry) {
  const formMethods = useForm({
    defaultValues: defaultInputData(fragment),
    resolver: yupResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultInputData(fragment));
  }, [reset, fragment]);

  /**
   * When modal is closed, reset form value with
   * default values derived from fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultInputData(fragment));
  }, [reset, fragment]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
