import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

const CreateFragment = graphql(/* GraphQL */ `
  fragment CommunityId_PropertyCreateModal on Community {
    id
  }
`);
export type CreateFragmentType = FragmentType<typeof CreateFragment>;

function schema() {
  return z.object({
    communityId: zz.string.nonEmpty(),
    address: zz.string.nonEmpty('Please provide an address'),
    streetNo: z.coerce
      .number({ message: 'Please provide a street number' })
      .int()
      .nullable(),
    streetName: zz.string.nonEmpty('Please provide a street name'),
    postalCode: z.string(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  item: GQL.CommunityId_PropertyCreateModalFragment
): InputData {
  return {
    communityId: item.id,
    address: '',
    streetNo: null,
    streetName: '',
    postalCode: '',
  };
}

export function useHookForm(fragment: CreateFragmentType) {
  const community = getFragment(CreateFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(community),
    [community]
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
