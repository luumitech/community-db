import { uiSlice } from './ui';

// Aggregate list of reducers
export const reducer = {
  ui: uiSlice.reducer,
};

// Aggregate list of actions
export const actions = {
  ui: uiSlice.actions,
};
