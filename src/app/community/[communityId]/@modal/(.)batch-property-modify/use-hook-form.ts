import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentDateAsISOString, getCurrentYear } from '~/lib/date-util';
import { isInteger, isNonEmpty, z, zz } from '~/lib/zod';

const ModifyFragment = graphql(/* GraphQL */ `
  fragment CommunityId_BatchPropertyModifyModal on Community {
    id
    updatedAt
    updatedBy {
      ...User
    }
  }
`);
type BatchPropertyModifyFragmentType = FragmentType<typeof ModifyFragment>;

function schema() {
  return z
    .object({
      self: z.object({
        id: zz.string.nonEmpty(),
        updatedAt: zz.string.nonEmpty(),
      }),
      method: z.nativeEnum(GQL.BatchModifyMethod),
      filter: z.object({
        memberYear: zz.coerce.toNumber({
          message: 'Must select a year',
          nullable: true,
        }),
        memberEvent: z.string().nullable(),
        withGps: zz.coerce.toBoolean({ nullable: true }),
      }),
      membership: z.object({
        year: zz.coerce.toNumber({ message: 'Must select a year' }),
        eventAttended: z.object({
          eventName: z.string(),
          eventDate: zz.coerce.toIsoDate(),
          ticketList: ticketListSchema,
        }),
        price: zz.coerce.toCurrency(),
        paymentMethod: z.string(),
      }),
      gps: z.object({
        city: z.string().nullable(),
        province: z.string().nullable(),
        country: z.string().nullable(),
      }),
    })
    .superRefine((form, ctx) => {
      if (form.method === GQL.BatchModifyMethod.AddEvent) {
        if (isInteger()(form.filter.memberYear) != null) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must select a year',
            path: ['filter', 'memberYear'],
          });
        }
        if (isNonEmpty()(form.membership.eventAttended.eventName) != null) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must select an event',
            path: ['membership', 'eventAttended', 'eventName'],
          });
        }
        if (isNonEmpty()(form.membership.paymentMethod) != null) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must specify payment method',
            path: ['membership', 'paymentMethod'],
          });
        }
      }
    });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  item: GQL.CommunityId_BatchPropertyModifyModalFragment,
  filter: GQL.PropertyFilterInput,
  defaultSetting: GQL.DefaultSetting
): InputData {
  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    method: GQL.BatchModifyMethod.AddEvent,
    filter: {
      memberYear: filter.memberYear ?? null,
      memberEvent: filter.memberEvent ?? null,
      withGps: filter.withGps ?? null,
    },
    membership: {
      year: getCurrentYear(),
      eventAttended: {
        eventName: '',
        eventDate: getCurrentDateAsISOString(),
        ticketList: [],
      },
      price: defaultSetting.membershipFee ?? null,
      paymentMethod: '',
    },
    gps: {
      city: null,
      province: null,
      country: null,
    },
  };
}

export function useHookForm(fragment: BatchPropertyModifyFragmentType) {
  const community = getFragment(ModifyFragment, fragment);
  const { defaultSetting } = useLayoutContext();
  const { filterArg } = useSelector((state) => state.searchBar);
  const defaultValues = React.useMemo(
    () => defaultInputData(community, filterArg, defaultSetting),
    [community, filterArg, defaultSetting]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, self };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
