import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { CommunityEntry } from '../_type';

const CreateFragment = graphql(/* GraphQL */ `
  fragment CommunityId_PropertyCreateModal on Community {
    id
  }
`);

function schema() {
  return z.object({
    communityId: zz.string.nonEmpty(),
    address: zz.string.nonEmpty('Please provide an address'),
    streetNo: zz.string.nonEmpty('Please provide a street number'),
    streetName: zz.string.nonEmpty('Please provide a street name'),
    postalCode: z.string(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
type DefaultData = DefaultInput<InputData>;

function defaultInputData(
  item: GQL.CommunityId_PropertyCreateModalFragment
): DefaultData {
  return {
    communityId: item.id,
    address: '',
    streetNo: '',
    streetName: '',
    postalCode: '',
  };
}

export function useHookFormWithDisclosure(fragment: CommunityEntry) {
  const community = getFragment(CreateFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(community),
    [community]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultValues);
  }, [reset, defaultValues]);

  /**
   * When modal is closed, reset form value with default values derived from
   * fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultInputData(fragment));
  }, [reset, fragment]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods, community };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
