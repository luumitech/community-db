import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { yearSelectItems } from '../year-select-items';

export const MembershipEditorFragment = graphql(/* GraphQL */ `
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
        ticket
      }
      paymentMethod
      paymentDeposited
    }
  }
`);
export type MembershipEditorFragmentType = FragmentType<
  typeof MembershipEditorFragment
>;

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    notes: z.string().nullable(),
    membershipList: z.array(
      z
        .object({
          year: zz.coerce.toNumber('Must select a year'),
          eventAttendedList: z
            .array(
              z.object({
                eventName: zz.string.nonEmpty('Must specify a value'),
                eventDate: zz.coerce.toIsoDate(),
                ticket: z.coerce
                  .number({ message: 'Must be a number' })
                  .int()
                  .min(0),
              })
            )
            .refine(
              (items) => {
                const eventNameList = items.map(({ eventName }) => eventName);
                return new Set(eventNameList).size === eventNameList.length;
              },
              { message: 'Event Name must be unique', path: [''] }
            ),
          paymentMethod: z.string().nullable(),
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

export function membershipDefault(
  year: number
): InputData['membershipList'][0] {
  return {
    year,
    eventAttendedList: [],
    paymentMethod: null,
  };
}

function defaultInputData(
  item: GQL.PropertyId_MembershipEditorFragment,
  yearRange: [number, number],
  yearSelected: string
): InputData {
  const membershipList = yearSelectItems(
    yearRange,
    item.membershipList,
    yearSelected
  );

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
        eventAttendedList: (
          membershipItem?.eventAttendedList ?? defaultItem.eventAttendedList
        ).map((event) => ({
          eventName: event.eventName ?? '',
          eventDate: event.eventDate ?? '',
          ticket: event.ticket,
        })),
        paymentMethod:
          membershipItem?.paymentMethod ?? defaultItem.paymentMethod,
      };
    }),
  };
}

export function useHookFormWithDisclosure(
  fragment: MembershipEditorFragmentType,
  yearSelected: string
) {
  const { minYear, maxYear } = useAppContext();
  const property = getFragment(MembershipEditorFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(property, [minYear, maxYear], yearSelected),
    [minYear, maxYear, property, yearSelected]
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
