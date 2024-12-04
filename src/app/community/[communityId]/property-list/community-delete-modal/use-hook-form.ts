import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { CommunityEntry } from '../_type';

const DeleteFragment = graphql(/* GraphQL */ `
  fragment CommunityId_CommunityDeleteModal on Community {
    id
    name
  }
`);

export function useHookFormWithDisclosure(fragment: CommunityEntry) {
  const disclosure = useDisclosure();
  const community = getFragment(DeleteFragment, fragment);

  return { disclosure, community };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;
