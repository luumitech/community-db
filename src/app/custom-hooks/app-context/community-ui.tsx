import {
  PayloadAction,
  bindActionCreators,
  createSlice,
} from '@reduxjs/toolkit';
import React from 'react';
import { getCurrentYear } from '~/lib/date-util';

type State = Readonly<{
  /**
   * Search bar text in community/[id]/property-list Persist this in redux so it
   * won't disappear when search bar unmounts
   */
  propertyListSearch?: string;
  /** Last event selected while editing membership detail */
  lastEventSelected?: string;
  /** Year selected In membership editor/membership display */
  yearSelected: string;
  /** Default ticket count when recording new event */
  defaultTicket: number;
}>;

const initialState: State = {
  propertyListSearch: undefined,
  lastEventSelected: undefined,
  yearSelected: getCurrentYear().toString(),
  defaultTicket: 0,
};

const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    reset: () => initialState,
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
    setYearSelected: (state, { payload }: PayloadAction<string>) => {
      state.yearSelected = payload;
    },
    setDefaultTicket: (state, { payload }: PayloadAction<number>) => {
      state.defaultTicket = payload;
    },
  },
});

export function useCommunityUi() {
  const [state, dispatch] = React.useReducer(slice.reducer, initialState);

  const actions = React.useMemo(
    () =>
      bindActionCreators(
        slice.actions,
        dispatch as AnyDispatch<State>
      ) as ActionCreatorMap<typeof slice.actions>,
    [dispatch]
  );

  return { ...state, actions } as const;
}

export type UseCommunityUiReturn = ReturnType<typeof useCommunityUi>;
