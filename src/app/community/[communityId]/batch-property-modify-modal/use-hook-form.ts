import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { ticketListSchema } from '~/community/[communityId]/common/ticket-input-table';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentDateAsISOString, getCurrentYear } from '~/lib/date-util';
import { isInteger, z, zz } from '~/lib/zod';

const BatchPropertyModifyFragment = graphql(/* GraphQL */ `
  fragment CommunityId_BatchPropertyModifyModal on Community {
    id
    name
    updatedAt
    updatedBy {
      ...User
    }
  }
`);
export type BatchPropertyModifyFragmentType = FragmentType<
  typeof BatchPropertyModifyFragment
>;

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    filter: z.object({
      memberYear: zz.coerce.toNumber({
        message: 'Must select a year',
        nullable: true,
        validateFn: isInteger('Must select a year'),
      }),
      memberEvent: z.string().nullable(),
    }),
    membership: z.object({
      year: zz.coerce.toNumber({ message: 'Must select a year' }),
      eventAttended: z.object({
        eventName: zz.string.nonEmpty('Must select an event'),
        eventDate: zz.coerce.toIsoDate(),
        ticketList: ticketListSchema,
      }),
      price: zz.coerce.toCurrency(),
      paymentMethod: zz.string.nonEmpty('Must specify payment method'),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  community: GQL.CommunityId_BatchPropertyModifyModalFragment,
  filter: GQL.PropertyFilterInput,
  defaultSetting: GQL.DefaultSetting
): InputData {
  return {
    self: {
      id: community.id,
      updatedAt: community.updatedAt,
    },
    filter: {
      memberYear: filter.memberYear ?? null,
      memberEvent: filter.memberEvent ?? null,
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
  const { defaultSetting } = useLayoutContext();
  const { filterArg } = useSelector((state) => state.searchBar);
  const community = getFragment(BatchPropertyModifyFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(community, filterArg, defaultSetting),
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
