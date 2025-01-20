import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useAppContext } from '~/custom-hooks/app-context';
import {
  useForm,
  useFormContext,
  type UseFieldArrayReturn,
} from '~/custom-hooks/hook-form';
import { getFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentDateAsISOString, getCurrentYear } from '~/lib/date-util';
import { parseAsNumber } from '~/lib/number-util';
import { z, zz } from '~/lib/zod';
import { type PropertyEntry } from '../_type';
import { MembershipEditorFragment } from '../membership-editor-modal/use-hook-form';

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    notes: z.string().nullable(),
    membership: z.object({
      year: zz.coerce.toNumber('Must select a year'),
      price: z.string().nullable(),
      paymentMethod: zz.string.nonEmpty('Must select a payment method'),
    }),
    event: z.object({
      eventName: zz.string.nonEmpty('Must specify a value'),
      eventDate: zz.coerce.toIsoDate(),
      ticketList: ticketListSchema,
    }),
    /** Whether member is already a member when registering */
    isMember: z.boolean(),
    /**
     * Determine if the register button should be enabled. For example, if user
     * is already registered in the event previously, then the register button
     * should not be enabled, unless they have modified the form.
     */
    canRegister: z.boolean(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  item: GQL.PropertyId_MembershipEditorFragment,
  lastEventSelected: string | undefined,
  yearSelected: string,
  defaultSetting: GQL.DefaultSetting
): InputData {
  const year = parseAsNumber(yearSelected) ?? getCurrentYear();
  const membership = item.membershipList.find((entry) => entry.year === year);
  const event = (membership?.eventAttendedList ?? []).find(
    (entry) => entry.eventName === lastEventSelected
  );
  const isMember = !!membership?.isMember;
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
      eventName: lastEventSelected ?? '',
      eventDate: event?.eventDate ?? getCurrentDateAsISOString(),
      ticketList: (event?.ticketList ?? []).map((ticket) => ({
        ticketName: ticket.ticketName ?? '',
        count: ticket.count ?? null,
        price: ticket.price ?? null,
        paymentMethod: ticket.paymentMethod ?? null,
      })),
    },
    isMember,
    canRegister,
  };
}

export function useHookFormWithDisclosure(fragment: PropertyEntry) {
  const { communityUi, defaultSetting } = useAppContext();
  const { yearSelected, lastEventSelected } = communityUi;
  const property = getFragment(MembershipEditorFragment, fragment);
  const defaultValues = React.useMemo(() => {
    return defaultInputData(
      property,
      lastEventSelected,
      yearSelected,
      defaultSetting
    );
  }, [property, lastEventSelected, yearSelected, defaultSetting]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
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

export type TicketListFieldArray = UseFieldArrayReturn<
  InputData,
  'event.ticketList'
>;

export type TicketField = TicketListFieldArray['fields'][0];
