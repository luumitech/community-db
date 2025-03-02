import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import { usePageContext } from '../page-context';

const DeleteFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDelete on Property {
    id
    address
  }
`);
export type DeleteFragmentType = FragmentType<typeof DeleteFragment>;

export function useHookForm() {
  const { property: fragment } = usePageContext();
  const property = getFragment(DeleteFragment, fragment);

  return { property };
}
