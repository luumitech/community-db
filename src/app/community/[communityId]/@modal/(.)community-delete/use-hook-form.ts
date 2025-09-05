import React from 'react';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';

const DeleteFragment = graphql(/* GraphQL */ `
  fragment CommunityId_CommunityDeleteModal on Community {
    id
    name
  }
`);
type DeleteFragmentType = FragmentType<typeof DeleteFragment>;

export function useHookForm(fragment: DeleteFragmentType) {
  const community = getFragment(DeleteFragment, fragment);

  return { community };
}
