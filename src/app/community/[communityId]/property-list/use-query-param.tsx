import { isAnyOf } from '@reduxjs/toolkit';
import {
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from 'next/navigation';
import React from 'react';
import * as R from 'remeda';
import { actions, addListener, useDispatch } from '~/custom-hooks/redux';

interface QueryParam {
  /** Search bar text content */
  searchText: string;

  /** Filter controls */
  /** Member year */
  memberYear: string;
  /** Non Member year */
  nonMemberYear: string;
  /** Event name */
  event: string;
}

const QUERY_PARAMS: QueryParam = {
  searchText: 'srch',
  memberYear: 'myr',
  nonMemberYear: 'nmyr',
  event: 'evt',
};

/** Map URL query parameters to redux states */
function getQueryParams(searchParams: ReadonlyURLSearchParams) {
  return R.mapValues(QUERY_PARAMS, (value, key) => {
    const param = searchParams.get(value);
    return param ?? undefined;
  });
}

/** Map Redux states to URL query parameters */
function setQueryParams(state: Partial<QueryParam>) {
  const params = new URLSearchParams();
  Object.keys(QUERY_PARAMS).forEach((_key) => {
    const key = _key as keyof QueryParam;
    const value = state[key];
    if (value) {
      params.set(QUERY_PARAMS[key], value);
    }
  });
  return params;
}

/**
 * Manage the query parameters on the URL, synchronize the search bar states
 * with the URL query parameters. Specifically:
 *
 * - Search text
 * - Filter controls
 */
export function useQueryParam() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const initializeState = React.useCallback(() => {
    const state = getQueryParams(searchParams);
    dispatch(actions.searchBar.setSearchText(state.searchText));
    dispatch(actions.searchBar.setMemberYear(state.memberYear));
    dispatch(actions.searchBar.setNonMemberYear(state.nonMemberYear));
    dispatch(actions.searchBar.setEvent(state.event));
  }, [dispatch, searchParams]);

  // React.useEffect(() => {
  //   initializeState();

  //   /** This should only be called once when the component mounts */
  //   const unsubscribe = dispatch(
  //     addListener({
  //       matcher: isAnyOf(
  //         actions.searchBar.setSearchText,
  //         actions.searchBar.setMemberYear,
  //         actions.searchBar.setNonMemberYear,
  //         actions.searchBar.setEvent
  //       ),
  //       effect: (action, api) => {
  //         const state = api.getState();
  //         const params = setQueryParams(state.searchBar);
  //         router.replace(`?${params.toString()}`);
  //       },
  //     })
  //   );
  //   // @ts-expect-error: unsubscribe does not have a function signature
  //   return () => unsubscribe();
  // }, []);

  React.use;
}
