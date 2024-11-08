import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zAsDate, zNonEmptyStr } from '~/lib/zod';
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
  return z.object({
    self: z.object({
      id: zNonEmptyStr(),
      updatedAt: zNonEmptyStr(),
    }),
    notes: zNonEmptyStr().nullable(),
    membershipList: z.array(
      z
        .object({
          year: z.coerce.number(),
          isMember: z.boolean(),
          eventAttendedList: z
            .array(
              z.object({
                eventName: zNonEmptyStr({ message: 'Must specify a value' }),
                eventDate: zAsDate(),
              })
            )
            .refine(
              (items) => {
                const eventNameList = items.map(({ eventName }) => eventName);
                return new Set(eventNameList).size === eventNameList.length;
              },
              { message: 'Event Name must be unique', path: [''] }
            ),
          paymentMethod: z.string(),
          paymentDeposited: z.boolean(),
        })
        .refine(
          (form) => {
            if (form.eventAttendedList.length === 0) {
              return true;
            }
            return !!form.paymentMethod;
          },
          {
            message:
              'Must specify payment method to indicate how membership fee is processsed',
            path: ['paymentMethod'],
          }
        )
        .refine(
          (form) => {
            if (!form.paymentMethod) {
              return true;
            }
            return form.eventAttendedList.length > 0;
          },
          {
            message:
              'Must add at least one event when Payment Method is specified',
            path: ['eventAttendedList', ''],
          }
        )
    ),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
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
  const property = getFragment(MembershipEditorFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(fragment, yearSelected),
    [fragment, yearSelected]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
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

  return { disclosure, formMethods, property };
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
