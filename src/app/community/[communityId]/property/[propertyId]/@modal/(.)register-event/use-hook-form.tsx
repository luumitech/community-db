import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  ticketListSchema,
  type ExistingMembership,
} from '~/community/[communityId]/common/ticket-input-table';
import { useLayoutContext as useCommunityLayoutContext } from '~/community/[communityId]/layout-context';
import {
  useForm,
  useFormContext,
  type UseFieldArrayReturn,
} from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import * as xtraArg from '~/custom-hooks/xtra-arg-context';
import { getFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/types';
import { getCurrentDateAsISOString, getCurrentYear } from '~/lib/date-util';
import { z, zz } from '~/lib/zod';
import { MembershipEditorFragment } from '../(.)membership-editor/use-hook-form';
import { useLayoutContext } from '../../layout-context';

function schema() {
  const ExistingMembershipSchema = z.object({
    year: z.number(),
    isMember: z.boolean().nullable().optional(),
    price: zz.coerce.toCurrency().optional(),
    paymentDate: zz.coerce.toIsoDate({ nullable: true }).optional(),
    paymentMethod: z.string().nullable().optional(),
  }) satisfies z.ZodType<ExistingMembership>;

  return z
    .object({
      self: z.object({
        id: zz.string.nonEmpty(),
        updatedAt: zz.string.nonEmpty(),
      }),
      notes: z.string().nullable(),
      membership: z.object({
        year: zz.coerce.toNumber({ message: 'Must select a year' }),
        isMember: z.boolean().nullable(),
        price: zz.coerce.toCurrency(),
        paymentDate: zz.coerce.toIsoDate({ nullable: true }),
      }),
      event: z.object({
        eventName: zz.string.nonEmpty('Must specify a value'),
        eventDate: zz.coerce.toIsoDate(),
        ticketList: ticketListSchema({ validatePaymentMethod: false }),
      }),
      transactionPaymentMethod: z.string().nullable(),
      hidden: z.object({
        /**
         * Determine if the register button should be enabled. For example, if
         * user is already registered in the event previously, then the register
         * button should not be enabled, unless they have modified the form.
         */
        canRegister: z.boolean(),
        /** User does not have membership, and can add membership to transaction */
        canPayMembership: z.boolean(),
        /**
         * If provided, will be shown in the previous transaction portion of the
         * ticket input
         */
        existingMembership: ExistingMembershipSchema.optional(),
      }),
    })
    .refine(
      (form) => {
        /**
         * Payment Method is only required if:
         *
         * - Membership fee entry has been added
         * - Ticket items have been added
         */
        if (
          (form.hidden.canPayMembership && form.membership.isMember) ||
          form.event.ticketList.length > 0
        ) {
          return !!form.transactionPaymentMethod;
        }
        return true;
      },
      {
        message: 'Must specify payment method for current transaction',
        path: ['transactionPaymentMethod'],
      }
    );
}

export type InputData = z.infer<ReturnType<typeof schema>>;

/**
 * Attempt to find event given year and eventName
 *
 * - Returns year (converted yearStr to number)
 * - Returns membership (if membership year is found, which indicates that they
 *   have existing membership)
 * - Returns event (if matching event is found, which indicates that they have
 *   already registerd at the event before)
 */
function findEvent(
  property: GQL.PropertyId_MembershipEditorFragment,
  yearNum: number | null,
  eventName: string
) {
  const year = yearNum ?? getCurrentYear();
  const membership = property.membershipList.find(
    (entry) => entry.year === year
  );
  const eventIdx = (membership?.eventAttendedList ?? []).findIndex(
    (entry) => entry.eventName === eventName
  );
  return {
    year,
    eventName,
    membership,
    event: membership?.eventAttendedList?.[eventIdx],
  };
}

function defaultInputData(
  item: GQL.PropertyId_MembershipEditorFragment,
  findEventResult: ReturnType<typeof findEvent>,
  defaultSetting: GQL.DefaultSetting
): InputData {
  const { year, eventName, membership, event } = findEventResult;
  const canRegister = !membership?.isMember || !event;
  const canPayMembership = !membership?.isMember;

  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    notes: item.notes ?? '',
    membership: {
      year,
      /**
       * Always give option to add membership initially, user would need to
       * remove the membership entry explicitly to opt out
       */
      isMember: true,
      ...(membership?.isMember
        ? {
            price: membership?.price ?? null,
            paymentDate: membership?.paymentDate ?? null,
            paymentMethod: membership?.paymentMethod ?? null,
          }
        : {
            price: defaultSetting.membershipFee ?? null,
            paymentDate: getCurrentDateAsISOString(),
            paymentMethod: null,
          }),
    },
    event: {
      eventName: eventName ?? '',
      eventDate: event?.eventDate ?? getCurrentDateAsISOString(),
      ticketList: [],
    },
    transactionPaymentMethod: null,
    hidden: {
      canRegister,
      canPayMembership,
      ...(membership?.paymentEventName === eventName && {
        existingMembership: membership,
      }),
    },
  };
}

export function useHookForm(eventName: string) {
  const { defaultSetting } = useCommunityLayoutContext();
  const { property: fragment } = useLayoutContext();
  const { yearSelected } = useSelector((state) => state.ui);
  const property = getFragment(MembershipEditorFragment, fragment);
  const findEventResult = React.useMemo(() => {
    return findEvent(property, yearSelected, eventName);
  }, [property, yearSelected, eventName]);
  const defaultValues = React.useMemo(() => {
    return defaultInputData(property, findEventResult, defaultSetting);
  }, [property, findEventResult, defaultSetting]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return {
    formMethods,
    property,
    membership: findEventResult.membership,
    ticketList: findEventResult.event?.ticketList ?? [],
  };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}

type HookFormXtraArgs = Omit<ReturnType<typeof useHookForm>, 'formMethods'>;
export const XtraArgProvider = xtraArg.XtraArgProvider<HookFormXtraArgs>;
export const useXtraArgContext = xtraArg.useXtraArgContext<HookFormXtraArgs>;

export type TicketListFieldArray = UseFieldArrayReturn<
  InputData,
  'event.ticketList'
>;

export type TicketField = TicketListFieldArray['fields'];
