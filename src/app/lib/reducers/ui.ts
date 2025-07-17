import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = Readonly<{
  /** Last event selected while editing membership detail */
  lastEventSelected?: string;
  /**
   * Year selected In:
   *
   * - Membership editor
   * - Dashboard
   * - Map view
   */
  yearSelected: number | null;
}>;

const initialState: State = {
  lastEventSelected: undefined,
  /**
   * Not defaulting to current year because membership data is not necessarily
   * available for current year
   */
  yearSelected: null,
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
    setYearSelected: (state, { payload }: PayloadAction<number | string>) => {
      const yearNum =
        typeof payload === 'string' ? parseInt(payload, 10) : payload;
      state.yearSelected = isNaN(yearNum) ? null : yearNum;
    },
  },
});
