import { useDisclosure } from '@nextui-org/react';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';

const DeleteFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDelete on Property {
    id
    address
  }
`);
export type DeleteFragmentType = FragmentType<typeof DeleteFragment>;

export function useHookFormWithDisclosure(fragment: DeleteFragmentType) {
  const property = getFragment(DeleteFragment, fragment);
  const disclosure = useDisclosure();

  return { disclosure, property };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;
