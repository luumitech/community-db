import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
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
import { parseAsNumber } from '~/lib/number-util';
import { z, zz } from '~/lib/zod';
import { MembershipEditorFragment } from '../membership-editor-modal/use-hook-form';
import { usePageContext } from '../page-context';

function schema() {
  return z.object({
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
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

/**
 * Attempt to find event given year and eventName
 *
 * - Returns year (converted yearStr to number)
 * - Returns membership (if membership year is found)
 * - Returns event (if matching event is found)
 */
function findEvent(
  property: GQL.PropertyId_MembershipEditorFragment,
  yearNum: number | null,
  eventName: string | undefined
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
    },
  };
}

export function useHookForm() {
  const { defaultSetting } = useLayoutContext();
  const { property: fragment } = usePageContext();
  const { yearSelected, lastEventSelected } = useSelector((state) => state.ui);
  const property = getFragment(MembershipEditorFragment, fragment);
  const findEventResult = React.useMemo(() => {
    return findEvent(property, yearSelected, lastEventSelected);
  }, [property, yearSelected, lastEventSelected]);
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
