import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useLayoutContext as useCommunityLayoutContext } from '~/community/[communityId]/layout-context';
import {
  useForm,
  useFormContext,
  type UseFieldArrayReturn,
} from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import * as xtraArg from '~/custom-hooks/xtra-arg-context';
import { getFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentDateAsISOString, getCurrentYear } from '~/lib/date-util';
import { z, zz } from '~/lib/zod';
import { MembershipEditorFragment } from '../(.)membership-editor/use-hook-form';
import { useLayoutContext } from '../../layout-context';

function schema() {
  return z
    .object({
      self: z.object({
        id: zz.string.nonEmpty(),
        updatedAt: zz.string.nonEmpty(),
      }),
      notes: z.string().nullable(),
      membership: z.object({
        year: zz.coerce.toNumber({ message: 'Must select a year' }),
        price: zz.coerce.toCurrency(),
        paymentMethod: zz.string.nonEmpty('Must select a payment method'),
      }),
      event: z.object({
        eventName: zz.string.nonEmpty('Must specify a value'),
        eventDate: zz.coerce.toIsoDate(),
        ticketList: ticketListSchema,
      }),
      hidden: z.object({
        /** Whether member is already a member when registering */
        isMember: z.boolean(),
        /**
         * Determine if the register button should be enabled. For example, if
         * user is already registered in the event previously, then the register
         * button should not be enabled, unless they have modified the form.
         */
        canRegister: z.boolean(),
        /**
         * The first event is when membership fee is collected. This information
         * is useful for determining if ticketList should show membership fee
         */
        isFirstEvent: z.boolean(),
        /** Transaction related fields */
        transaction: z.object({
          /** Selected payment on `Current Transaction Total` */
          paymentMethod: z.string().nullable(),
          /** Selected payment should apply to membership also */
          applyToMembership: z.boolean(),
        }),
      }),
    })
    .refine(
      (form) => {
        /**
         * Payment Method is only required if:
         *
         * - Membership fee has not been paid
         * - Ticket items have been added
         */
        if (
          form.hidden.transaction.applyToMembership ||
          form.event.ticketList.length > 0
        ) {
          return !!form.hidden.transaction.paymentMethod;
        }
        return true;
      },
      {
        message: 'Must specify payment method for current transaction',
        path: ['hidden.transaction.paymentMethod'],
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

  const isMember = !!membership?.isMember;
  return {
    year,
    eventName,
    membership,
    event: membership?.eventAttendedList?.[eventIdx],
    isMember,
    isFirstEvent: eventIdx === 0 || !isMember,
  };
}

function defaultInputData(
  item: GQL.PropertyId_MembershipEditorFragment,
  findEventResult: ReturnType<typeof findEvent>,
  defaultSetting: GQL.DefaultSetting
): InputData {
  const { year, eventName, membership, event, isMember, isFirstEvent } =
    findEventResult;
  const canRegister = !isMember || !event;

  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    notes: item.notes ?? '',
    membership: {
      year,
      price: membership?.price ?? defaultSetting.membershipFee ?? null,
      paymentMethod: membership?.paymentMethod ?? '',
    },
    event: {
      eventName: eventName ?? '',
      eventDate: event?.eventDate ?? getCurrentDateAsISOString(),
      ticketList: [],
    },
    hidden: {
      isMember,
      canRegister,
      isFirstEvent,
      transaction: {
        paymentMethod: '',
        applyToMembership: !membership?.paymentMethod,
      },
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
