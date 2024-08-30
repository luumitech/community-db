import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { type PropertyEntry } from '../_type';
import { yearSelectItems } from '../year-select-items';

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

function defaultInputData(
  fragment: PropertyEntry,
  yearSelected: string
): DefaultData {
  const item = getFragment(MembershipEditorFragment, fragment);
  const membershipList = yearSelectItems(item.membershipList, yearSelected);

  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    notes: item.notes ?? '',
    // Makes sure the membership list always contain all the years listed
    // in the year selection list (and in the same order as selection list)
    membershipList: membershipList.map(({ value }) => {
      const membershipItem = item.membershipList.find(
        (mEntry) => mEntry.year === value
      );
      const defaultItem = membershipDefault(value);

      return {
        year: membershipItem?.year ?? defaultItem.year,
        isMember: membershipItem?.isMember ?? defaultItem.isMember,
        eventAttendedList: (
          membershipItem?.eventAttendedList ?? defaultItem.eventAttendedList
        ).map((event) => ({
          eventName: event.eventName ?? '',
          eventDate: event.eventDate ?? '',
        })),
        paymentMethod:
          membershipItem?.paymentMethod ?? defaultItem.paymentMethod,
        paymentDeposited:
          membershipItem?.paymentDeposited ?? defaultItem.paymentDeposited,
      };
    }),
  };
}

export function useHookFormWithDisclosure(
  fragment: PropertyEntry,
  yearSelected: string
) {
  const defaultValues = React.useMemo(
    () => defaultInputData(fragment, yearSelected),
    [fragment, yearSelected]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: yupResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultValues);
  }, [reset, defaultValues]);

  /**
   * When modal is closed, reset form value with default values derived from
   * fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods, fragment };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}

export type MembershipListFieldArray = UseFieldArrayReturn<
  InputData,
  'membershipList'
>;
