import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import * as GQL from '~/graphql/generated/graphql';

type State = Readonly<{
  /** Current active community name */
  communityName?: string;
  /** Current user's role in the active community */
  role: GQL.Role;
  /** Base on current user's role, can user modify content within this community? */
  canEdit: boolean;
  /** Is user an admin? */
  isAdmin: boolean;
}>;

const initialState: State = {
  communityName: undefined,
  role: GQL.Role.Viewer,
  canEdit: false,
  isAdmin: false,
};

/**
 * Keep tracks of community related information used for rendering:
 *
 * - Header menu
 * - Role differentiation
 */
export const communitySlice = createSlice({
  name: 'header',
  initialState,
  reducers: {
    reset: () => initialState,
    setCommunity: (
      state,
      { payload }: PayloadAction<GQL.CommunityLayoutQuery['communityFromId']>
    ) => {
      const community = payload;
      state.communityName = community.name;
      state.role = community.access.role;
      state.canEdit =
        state.role === GQL.Role.Admin || state.role === GQL.Role.Editor;
      state.isAdmin = state.role === GQL.Role.Admin;
    },
  },
});
