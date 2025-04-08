import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';
import { actions, addListener } from '~/custom-hooks/redux';

export type QueryParamState = Readonly<{
  /** Search bar text content */
  searchText: string;

  /** Filter controls */
  /** Member year */
  memberYear: string;
  /** Non Member year */
  nonMemberYear: string;
  /** Event name */
  event: string;
}>;

const QUERY_PARAMS = {
  searchText: 'srch',
  memberYear: 'myr',
  nonMemberYear: 'nmyr',
  event: 'evt',
};

export function useQueryParam() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const unsubscribe = dispatch(
      addListener({
        actionCreator: actions.searchBar.setSearchText,
        effect: (action, listener) => {
          setQueryParams({
            searchText: action.payload,
          });
        },
      })
    );
    // @ts-expect-error
    return () => unsubscribe();
  }, []);

  const queryParams = React.useMemo(() => {
    return {
      searchText: searchParams.get(QUERY_PARAMS.searchText) ?? '',
      memberYear: searchParams.get(QUERY_PARAMS.memberYear) ?? '',
      nonMemberYear: searchParams.get(QUERY_PARAMS.nonMemberYear) ?? '',
      event: searchParams.get(QUERY_PARAMS.event) ?? '',
    };
  }, []);

  /**
   * Set key-value pairs to URL query string
   *
   * - To clear a key, set its value to empty string (ie.'')
   *
   * @param params - Key-value pairs to set
   */
  const setQueryParams = React.useCallback(
    (params: Partial<QueryParamState>) => {
      const newParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([_key, value]) => {
        const key = _key as keyof QueryParamState;
        if (value) {
          newParams.set(QUERY_PARAMS[key], value);
        } else {
          newParams.delete(QUERY_PARAMS[key]);
        }
      });
      router.replace(`${pathname}?${newParams}`);
    },
    [searchParams, pathname, router]
  );

  return {
    setQueryParams,
    ...queryParams,
  };
}
