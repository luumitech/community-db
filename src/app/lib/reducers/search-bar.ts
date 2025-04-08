import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { listenerMiddleware } from './listener';

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
}>;

const initialState: State = {
  searchText: undefined,
  debouncedSearchText: undefined,
};

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
    },
  },
});

listenerMiddleware.startListening({
  actionCreator: searchBarSlice.actions.setSearchText,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners();
    await listenerApi.delay(1000);
    listenerApi.dispatch(
      searchBarSlice.actions.setDebouncedSearchText(action.payload)
    );
    console.log(action);
  },
});
