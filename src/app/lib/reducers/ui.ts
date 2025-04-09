import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getCurrentYear } from '~/lib/date-util';

type State = Readonly<{
  /** Last event selected while editing membership detail */
  lastEventSelected?: string;
  /** Year selected In membership editor/membership display */
  yearSelected: string;
}>;

const initialState: State = {
  lastEventSelected: undefined,
  yearSelected: getCurrentYear().toString(),
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    reset: () => initialState,
    setLastEventSelected: (
      state,
      { payload }: PayloadAction<string | null | undefined>
    ) => {
      state.lastEventSelected = payload ?? undefined;
    },
    setYearSelected: (state, { payload }: PayloadAction<string>) => {
      state.yearSelected = payload;
    },
  },
});
