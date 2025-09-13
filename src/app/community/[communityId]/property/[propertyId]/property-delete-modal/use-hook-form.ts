import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import { useLayoutContext } from '../layout-context';

const DeleteFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyDelete on Property {
    id
    address
  }
`);
export type DeleteFragmentType = FragmentType<typeof DeleteFragment>;

export function useHookForm() {
  const { property: fragment } = useLayoutContext();
  const property = getFragment(DeleteFragment, fragment);

  return { property };
}
