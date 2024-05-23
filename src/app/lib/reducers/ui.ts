import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = Readonly<{
  /**
   * Search bar text in community/[id]/property-list
   * Persist this in redux so it won't disappear when search bar unmounts
   */
  propertyListSearch?: string;
  /**
   * Last event selected while editing membership detail
   */
  lastEventSelected?: string;
}>;

const initialState: State = {
  propertyListSearch: undefined,
  lastEventSelected: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPropertyListSearch: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.propertyListSearch = payload;
    },
    setLastEventSelected: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.lastEventSelected = payload;
    },
  },
});
