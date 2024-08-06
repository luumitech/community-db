import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type State = Readonly<unknown>;

const initialState: State = {};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {},
});
