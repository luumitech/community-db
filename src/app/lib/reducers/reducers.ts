import { searchBarSlice } from './search-bar';
import { uiSlice } from './ui';

// Aggregate list of reducers
export const reducer = {
  ui: uiSlice.reducer,
  searchBar: searchBarSlice.reducer,
};

// Aggregate list of actions
export const actions = {
  ui: uiSlice.actions,
  searchBar: searchBarSlice.actions,
};
