import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as R from 'remeda';
import { type SortDescriptor } from '~/community/[communityId]/third-party-integration/mailchimp/audience-list/audience-table';
import * as GQL from '~/graphql/generated/graphql';

/** Filters available on the mailchimp integration search bar */
export interface FilterT {
  subscriberStatusList: GQL.MailchimpSubscriberStatus[];
  optOut: boolean | null;
  warning: boolean | null;
}

/**
 * States used within
 *
 * - Third party integration.. mailchimp
 */
type State = Readonly<{
  /** Last selected Mailchimp audience list */
  audienceListId?: string;

  /**
   * Search bar text
   *
   * This is used to render the search bar input text. Persist this in redux so
   * it won't disappear when search bar unmounts
   */
  searchText?: string;
  /** Table sorting descriptor */
  sortDescriptor: SortDescriptor | null;

  /** Filter options */
  filter: FilterT;

  /** Has Filter control been specified */
  isFilterSpecified: boolean;
}>;

export const initialState: State = {
  audienceListId: undefined,
  searchText: undefined,
  sortDescriptor: null,
  filter: {
    subscriberStatusList: [],
    optOut: null,
    warning: null,
  },
  isFilterSpecified: false,
};

/**
 * Check if any of the filter controls have been specified
 *
 * - I.e. differ from inital state
 *
 * @param filter Current filter state
 */
export function isFilterSpecified(filter: FilterT) {
  return !R.isDeepEqual(filter, initialState.filter);
}

export const mailchimpSlice = createSlice({
  name: 'mailchimp',
  initialState,
  reducers: {
    reset: () => initialState,
    setSearchText: (state, { payload }: PayloadAction<string | undefined>) => {
      state.searchText = payload;
    },
    setAudienceListId: (
      state,
      { payload }: PayloadAction<string | null | undefined>
    ) => {
      state.audienceListId = payload ?? undefined;
    },
    setSortDescriptor: (
      state,
      { payload }: PayloadAction<SortDescriptor | null>
    ) => {
      state.sortDescriptor = payload;
    },
    setFilter: (state, { payload }: PayloadAction<FilterT>) => {
      state.filter.subscriberStatusList = payload.subscriberStatusList;
      state.filter.optOut = payload.optOut;
      state.filter.warning = payload.warning;
      state.isFilterSpecified = isFilterSpecified(state.filter);
    },
  },
});
