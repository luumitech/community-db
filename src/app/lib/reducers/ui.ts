import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = Readonly<{
  /**
   * Search bar text in community/[id]/property-list
   * For disabling the spreadsheet view while the view is being updated
   */
  propertyListSearch?: string;
}>;

const initialState: State = {
  propertyListSearch: undefined,
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
  },
});
