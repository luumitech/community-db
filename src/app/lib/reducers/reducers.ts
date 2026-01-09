import { communitySlice } from './community';
import { mailchimpSlice } from './mailchimp';
import { searchBarSlice } from './search-bar';
import { uiSlice } from './ui';

// Aggregate list of reducers
export const reducer = {
  community: communitySlice.reducer,
  mailchimp: mailchimpSlice.reducer,
  searchBar: searchBarSlice.reducer,
  ui: uiSlice.reducer,
};

// Aggregate list of actions
export const actions = {
  community: communitySlice.actions,
  mailchimp: mailchimpSlice.actions,
  searchBar: searchBarSlice.actions,
  ui: uiSlice.actions,
};
