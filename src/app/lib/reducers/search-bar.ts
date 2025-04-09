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
  memberYear?: string;
  nonMemberYear?: string;
  event?: string;

  /** Has Filter control been specified */
  isFilterSpecified: boolean;

  /** Property filter arguments */
  filterArg: GQL.PropertyFilterInput;
}>;

const initialState: State = {
  searchText: undefined,
  debouncedSearchText: undefined,
  memberYear: undefined,
  nonMemberYear: undefined,
  event: undefined,
  isFilterSpecified: false,
  filterArg: {},
};

/**
 * Check if any of the filter controls have been specified
 *
 * @param state
 */
function isFilterSpecified(state: State) {
  return !!state.memberYear || !!state.nonMemberYear || !!state.event;
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
  const selectedMemberYear = parseInt(state.memberYear ?? '', 10);
  if (!isNaN(selectedMemberYear)) {
    arg.memberYear = selectedMemberYear;
  }
  const selectedNonMemberYear = parseInt(state.nonMemberYear ?? '', 10);
  if (!isNaN(selectedNonMemberYear)) {
    arg.nonMemberYear = selectedNonMemberYear;
  }
  if (state.event) {
    arg.memberEvent = state.event;
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
    setMemberYear: (state, { payload }: PayloadAction<string | undefined>) => {
      state.memberYear = payload;
      state.isFilterSpecified = isFilterSpecified(state);
      state.filterArg = filterArg(state);
    },
    setNonMemberYear: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.nonMemberYear = payload;
      state.isFilterSpecified = isFilterSpecified(state);
      state.filterArg = filterArg(state);
    },
    setEvent: (state, { payload }: PayloadAction<string | undefined>) => {
      state.event = payload;
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
