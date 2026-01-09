import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { startListening } from './listener';

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
  memberYearList: number[];
  nonMemberYearList: number[];
  memberEventList: string[];
  withGps: boolean | null;

  /** Has Filter control been specified */
  isFilterSpecified: boolean;

  /** Property filter arguments */
  filterArg: GQL.PropertyFilterInput;
}>;

export const initialState: State = {
  searchText: undefined,
  debouncedSearchText: undefined,
  memberYearList: [],
  nonMemberYearList: [],
  memberEventList: [],
  withGps: null,
  isFilterSpecified: false,
  filterArg: {},
};

export type FilterT = Pick<
  State,
  'memberYearList' | 'nonMemberYearList' | 'memberEventList' | 'withGps'
>;
/**
 * Check if any of the filter controls have been specified
 *
 * - I.e. differ from inital state
 *
 * @param state
 */
export function isFilterSpecified(state: FilterT) {
  const filterProp = [
    'memberYearList',
    'nonMemberYearList',
    'memberEventList',
    'withGps',
  ] as const;

  return !R.isDeepEqual(
    R.pick(state, filterProp),
    R.pick(initialState, filterProp)
  );
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
  arg.memberYearList = state.memberYearList;
  arg.nonMemberYearList = state.nonMemberYearList;
  arg.memberEventList = state.memberEventList;

  if (state.withGps != null) {
    arg.withGps = state.withGps;
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
      state.memberYearList = payload.memberYearList;
      state.nonMemberYearList = payload.nonMemberYearList;
      state.memberEventList = payload.memberEventList;
      state.withGps = payload.withGps;
      state.isFilterSpecified = isFilterSpecified(state);
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
