import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { startListening } from './listener';

/** Filters available on the property list search bar */
export interface FilterT {
  memberYearList: number[];
  nonMemberYearList: number[];
  memberEventList: string[];
  withGps: boolean | null;
}

type State = Readonly<{
  /**
   * Search bar text in:
   *
   * - `community/[id]/property-list` and
   * - `community/[id]/property/[id]`
   *
   * This is used to render the search bar input text. Persist this in redux so
   * it won't disappear when search bar unmounts
   */
  searchText?: string;

  /**
   * Actual search text to be passed into graphQL API, this contains the
   * `searchText` value after deboucing for a little bit of time
   */
  debouncedSearchText?: string;

  /** Filter controls */
  filter: FilterT;

  /** Has Filter control been specified */
  isFilterSpecified: boolean;

  /** Constructed Property filter arguments for graphQL query */
  filterArg: GQL.PropertyFilterInput;
}>;

export const initialState: State = {
  searchText: undefined,
  debouncedSearchText: undefined,
  filter: {
    memberYearList: [],
    nonMemberYearList: [],
    memberEventList: [],
    withGps: null,
  },
  isFilterSpecified: false,
  filterArg: {},
};

/**
 * Check if any of the filter controls have been specified
 *
 * - I.e. differ from inital state
 *
 * @param filter Current filter state
 */
export function isFilterSpecified(FilterT: FilterT) {
  return !R.isDeepEqual(FilterT, initialState.filter);
}

/**
 * Generate the filter arguments to be passed into graphQL API
 *
 * @param state
 */
function filterArg(state: State) {
  const arg: GQL.PropertyFilterInput = {};
  if (state.debouncedSearchText) {
    arg.searchText = state.debouncedSearchText;
  }
  arg.memberYearList = state.filter.memberYearList;
  arg.nonMemberYearList = state.filter.nonMemberYearList;
  arg.memberEventList = state.filter.memberEventList;

  if (state.filter.withGps != null) {
    arg.withGps = state.filter.withGps;
  }
  return arg;
}

export const searchBarSlice = createSlice({
  name: 'searchBar',
  initialState,
  reducers: {
    reset: () => initialState,
    setSearchText: (state, { payload }: PayloadAction<string | undefined>) => {
      state.searchText = payload;
    },
    setDebouncedSearchText: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.debouncedSearchText = payload;
      state.filterArg = filterArg(state);
    },
    setFilter: (state, { payload }: PayloadAction<FilterT>) => {
      state.filter.memberYearList = payload.memberYearList;
      state.filter.nonMemberYearList = payload.nonMemberYearList;
      state.filter.memberEventList = payload.memberEventList;
      state.filter.withGps = payload.withGps;
      state.isFilterSpecified = isFilterSpecified(state.filter);
      state.filterArg = filterArg(state);
    },
  },
});

/** Listener middlewares */

startListening({
  actionCreator: searchBarSlice.actions.setSearchText,
  effect: async (action, api) => {
    /* Debounce search text, so that API don't gets called repeatedly  */
    api.cancelActiveListeners();
    await api.delay(300);
    api.dispatch(searchBarSlice.actions.setDebouncedSearchText(action.payload));
  },
});
