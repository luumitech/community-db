import { type SortDescriptor } from '@heroui/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * States used within
 *
 * - Third party integration.. mailchimp
 */
type State = Readonly<{
  /** Last selected Mailchimp audience list */
  audienceListId?: string;
  /** Table sorting descriptor */
  sortDescriptor?: SortDescriptor;
}>;

const initialState: State = {
  audienceListId: undefined,
  sortDescriptor: undefined,
};

export const mailchimpSlice = createSlice({
  name: 'mailchimp',
  initialState,
  reducers: {
    reset: () => initialState,
    setAudienceListId: (
      state,
      { payload }: PayloadAction<string | null | undefined>
    ) => {
      state.audienceListId = payload ?? undefined;
    },
    setSortDescriptor: (
      state,
      { payload }: PayloadAction<SortDescriptor | undefined>
    ) => {
      state.sortDescriptor = payload;
    },
  },
});
