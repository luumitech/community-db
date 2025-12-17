import { PayloadAction, createSlice } from '@reduxjs/toolkit';
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
  memberEvent: string | null;
  withGps: boolean | null;

  /** Has Filter control been specified */
  isFilterSpecified: boolean;

  /** Property filter arguments */
  filterArg: GQL.PropertyFilterInput;
}>;

const initialState: State = {
  searchText: undefined,
  debouncedSearchText: undefined,
  memberYearList: [],
  nonMemberYearList: [],
  memberEvent: null,
  withGps: null,
  isFilterSpecified: false,
  filterArg: {},
};

/**
 * Check if any of the filter controls have been specified
 *
 * @param state
 */
function isFilterSpecified(state: State) {
  return (
    state.memberYearList.length > 0 ||
    state.nonMemberYearList.length > 0 ||
    state.memberEvent != null ||
    state.withGps != null
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
  if (state.memberEvent != null) {
    arg.memberEvent = state.memberEvent;
  }
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
    setMemberYearList: (state, { payload }: PayloadAction<number[]>) => {
      state.memberYearList = payload;
      state.isFilterSpecified = isFilterSpecified(state);
      state.filterArg = filterArg(state);
    },
    setNonMemberYearList: (state, { payload }: PayloadAction<number[]>) => {
      state.nonMemberYearList = payload;
      state.isFilterSpecified = isFilterSpecified(state);
      state.filterArg = filterArg(state);
    },
    setMemberEvent: (state, { payload }: PayloadAction<string | null>) => {
      state.memberEvent = payload;
      state.isFilterSpecified = isFilterSpecified(state);
      state.filterArg = filterArg(state);
    },
    setWithGps: (state, { payload }: PayloadAction<boolean | null>) => {
      state.withGps = payload;
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
