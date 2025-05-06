import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { usePageContext } from '../page-context';
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
        ticketList {
          ticketName
          count
          price
          paymentMethod
        }
      }
      paymentMethod
      paymentDeposited
      price
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
          year: zz.coerce.toNumber({ message: 'Must select a year' }),
          eventAttendedList: z
            .array(
              z.object({
                eventName: zz.string.nonEmpty('Must specify a value'),
                eventDate: zz.coerce.toIsoDate(),
                ticketList: ticketListSchema,
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
          price: z.string().nullable(),
        })
        .refine(
          (form) => {
            if (form.eventAttendedList.length === 0) {
              return true;
            }
            return !!form.paymentMethod;
          },
          {
            message: 'Must specify payment method for membership fee',
            path: ['paymentMethod'],
          }
        )
    ),
    hidden: z.object({
      /**
       * For controlling which ticketList table should be shown
       *
       * Used in `Edit Membership Detail` modal, where we only show one
       * ticketList table at a time (i.e. accordian style)
       */
      membershipList: z.array(
        z.object({
          // Means ticketList should be expanded for event section of specified index
          expandTicketListEventIdx: z.number().nullable(),
        })
      ),
    }),
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
    price: null,
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
          ticketList: event.ticketList.map((ticket) => ({
            ticketName: ticket.ticketName,
            count: ticket.count ?? null,
            price: ticket.price ?? '',
            paymentMethod: ticket.paymentMethod ?? '',
          })),
        })),
        paymentMethod:
          membershipItem?.paymentMethod ?? defaultItem.paymentMethod,
        price: membershipItem?.price ?? defaultItem.price ?? null,
      };
    }),
    hidden: {
      membershipList: membershipList.map((v) => ({
        // Automatically expand the ticketList table in the first event
        expandTicketListEventIdx: 0,
      })),
    },
  };
}

export function useHookForm() {
  const { minYear, maxYear } = useAppContext();
  const { yearSelected } = useSelector((state) => state.ui);
  const { property: fragment } = usePageContext();
  const property = getFragment(MembershipEditorFragment, fragment);
  const defaultValues = React.useMemo(() => {
    const data = defaultInputData(property, [minYear, maxYear], yearSelected);
    return data;
  }, [minYear, maxYear, property, yearSelected]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, property };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}

export type MembershipListFieldArray = UseFieldArrayReturn<
  InputData,
  'membershipList'
>;

export type EventAttendedListFieldArray = UseFieldArrayReturn<
  InputData,
  `membershipList.${number}.eventAttendedList`
>;

export type TicketListFieldArray = UseFieldArrayReturn<
  InputData,
  `membershipList.${number}.eventAttendedList.${number}.ticketList`
>;

export type MembershipField = MembershipListFieldArray['fields'][0];
export type EventField = EventAttendedListFieldArray['fields'][0];
export type TicketField = TicketListFieldArray['fields'][0];
