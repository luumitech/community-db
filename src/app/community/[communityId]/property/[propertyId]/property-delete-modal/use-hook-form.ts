import { useDisclosure } from '@nextui-org/react';
import { getFragment, graphql } from '~/graphql/generated';
import { PropertyEntry } from '../_type';

const DeleteFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDelete on Property {
    id
    address
  }
`);

export function useHookFormWithDisclosure(fragment: PropertyEntry) {
  const property = getFragment(DeleteFragment, fragment);
  const disclosure = useDisclosure();

  return { disclosure, property };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;
