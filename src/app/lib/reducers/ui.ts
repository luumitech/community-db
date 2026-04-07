import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = Readonly<{
  /** Last event selected while editing membership detail */
  lastEventSelected?: string;
  /**
   * Year selected in:
   *
   * - Property View
   * - Membership editor
   * - Dashboard
   * - Map view
   */
  yearSelected: number | null;
  /**
   * Ticket selected in:
   *
   * - Property view
   */
  ticketSelected?: string;
}>;

const initialState: State = {
  lastEventSelected: undefined,
  /**
   * Not defaulting to current year because membership data is not necessarily
   * available for current year
   */
  yearSelected: null,
  ticketSelected: undefined,
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
    setTicketSelected: (
      state,
      { payload }: PayloadAction<string | undefined>
    ) => {
      state.ticketSelected = payload ?? undefined;
    },
  },
});
