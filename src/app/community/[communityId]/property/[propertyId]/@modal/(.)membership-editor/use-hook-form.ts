import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useLayoutContext as useCommunityLayoutContext } from '~/community/[communityId]/layout-context';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { isNonEmpty, z, zz } from '~/lib/zod';
import { useLayoutContext } from '../../layout-context';
import { yearSelectItems } from '../../year-select-items';

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
      paymentEventName
      paymentDate
      paymentMethod
      paymentDeposited
      price
      eventAttendedList {
        eventName
        eventDate
        ticketList {
          ticketName
          count
          price
          paymentMethod
          paymentDate
        }
      }
    }
    ...PropertyList_Occupant
  }
`);
type MembershipEditorFragmentType = FragmentType<
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
          isMember: z.boolean().nullable(),
          paymentEventName: z.string().nullable(),
          price: zz.coerce.toCurrency(),
          paymentDate: zz.coerce.toIsoDate({ nullable: true }),
          paymentMethod: z.string().nullable(),
          eventAttendedList: z
            .array(
              z.object({
                eventName: zz.string.nonEmpty('Must specify a value'),
                eventDate: zz.coerce.toIsoDate(),
                ticketList: ticketListSchema({ validatePaymentMethod: true }),
              })
            )
            .refine(
              (items) => {
                const eventNameList = items.map(({ eventName }) => eventName);
                return new Set(eventNameList).size === eventNameList.length;
              },
              { message: 'Event Name must be unique', path: [''] }
            ),
        })
        .superRefine((form, ctx) => {
          if (form.isMember) {
            if (isNonEmpty()(form.paymentEventName) != null) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must select an event',
                path: ['paymentEventName'],
              });
            }
            if (isNonEmpty()(form.price) != null) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must specify membership fee',
                path: ['price'],
              });
            }
            if (isNonEmpty()(form.paymentDate) != null) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must select a date',
                path: ['paymentDate'],
              });
            }
            if (isNonEmpty()(form.paymentMethod) != null) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Must select payment method',
                path: ['paymentMethod'],
              });
            }
          }
        })
    ),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export function membershipDefault(
  year: number
): InputData['membershipList'][number] {
  return {
    year,
    isMember: null,
    paymentEventName: null,
    price: null,
    paymentDate: null,
    paymentMethod: null,
    eventAttendedList: [],
  };
}

function defaultInputData(
  item: GQL.PropertyId_MembershipEditorFragment,
  yearRange: [number, number],
  yearSelected?: number | null
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
    membershipList: membershipList.map(({ key }) => {
      const membershipItem = item.membershipList.find(
        (mEntry) => mEntry.year === key
      );
      const defaultItem = membershipDefault(key);

      return {
        year: membershipItem?.year ?? defaultItem.year,
        isMember: membershipItem?.isMember ?? defaultItem.isMember,
        paymentEventName:
          membershipItem?.paymentEventName ?? defaultItem.paymentEventName,
        price: membershipItem?.price ?? defaultItem.price ?? null,
        paymentDate: membershipItem?.paymentDate ?? defaultItem.paymentDate,
        paymentMethod:
          membershipItem?.paymentMethod ?? defaultItem.paymentMethod,
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
            paymentDate: ticket.paymentDate ?? null,
          })),
        })),
      };
    }),
  };
}

export function useHookForm() {
  const { minYear, maxYear } = useCommunityLayoutContext();
  const { yearSelected } = useSelector((state) => state.ui);
  const { property: fragment } = useLayoutContext();
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

export type MembershipField = MembershipListFieldArray['fields'][number];
export type EventField = EventAttendedListFieldArray['fields'][number];
export type TicketField = TicketListFieldArray['fields'][number];
