import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useAppContext } from '~/custom-hooks/app-context';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentDateAsISOString, getCurrentYear } from '~/lib/date-util';
import { z, zz } from '~/lib/zod';

const BatchPropertyModifyFragment = graphql(/* GraphQL */ `
  fragment CommunityId_BatchPropertyModifyModal on Community {
    id
    name
  }
`);
export type BatchPropertyModifyFragmentType = FragmentType<
  typeof BatchPropertyModifyFragment
>;

function schema() {
  return z.object({
    communityId: zz.string.nonEmpty(),
    filter: z.object({
      memberYear: zz.coerce.toNumber({ message: 'Must select a year' }),
      memberEvent: z.string().nullable(),
    }),
    membership: z.object({
      year: zz.coerce.toNumber({ message: 'Must select a year' }),
      eventAttended: z.object({
        eventName: zz.string.nonEmpty('Must select an event'),
        eventDate: zz.coerce.toIsoDate(),
        ticketList: ticketListSchema,
      }),
      price: z.string().nullable(),
      paymentMethod: zz.string.nonEmpty('Must specify payment method'),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  communityId: string,
  filter: GQL.PropertyFilterInput,
  defaultSetting: GQL.DefaultSetting
): InputData {
  return {
    communityId,
    filter: {
      memberEvent: filter.memberEvent ?? null,
      memberYear: filter.memberYear ?? NaN,
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
  };
}

export function useHookForm(fragment: BatchPropertyModifyFragmentType) {
  const { defaultSetting } = useAppContext();
  const { filterArg } = useSelector((state) => state.searchBar);
  const community = getFragment(BatchPropertyModifyFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(community.id, filterArg, defaultSetting),
    [community, filterArg, defaultSetting]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, community };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
