import { type SortDescriptor } from '@heroui/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';

/**
 * Status items and corresponding labels for GQL.MailchimpSubscriberStatus
 *
 * - Used for SelectItem component
 */
export interface SubscriberStatusItem {
  key: GQL.MailchimpSubscriberStatus;
  label: string;
  desc: string;
}

export const subscriberStatusItems: SubscriberStatusItem[] = [
  {
    key: GQL.MailchimpSubscriberStatus.Subscribed,
    label: 'Subscribed',
    desc: 'These are individuals who have opted in to receive your email marketing campaigns',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Unsubscribed,
    label: 'Unsubscribed',
    desc: 'These are individuals who previously opted in but have since opted out',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Cleaned,
    label: 'Cleaned',
    desc: 'These are non-deliverable email addresses, either due to hard bounces (permanent failure) or repeated soft bounces (temporary failure)',
  },
  {
    key: GQL.MailchimpSubscriberStatus.Pending,
    label: 'Pending',
    desc: "These are email addresses that are waiting for confirmation or haven't been fully verified",
  },
  {
    key: GQL.MailchimpSubscriberStatus.Transactional,
    label: 'Transactional',
    desc: "These are individuals who have interacted with your online store or provided contact information but haven't opted in to receive email marketing campaigns",
  },
  {
    key: GQL.MailchimpSubscriberStatus.Archive,
    label: 'Archive',
    desc: 'These are contacts that have been moved to a separate archived contacts table, effectively removing them from the main list',
  },
];

const SUBSCRIBER_STATUS_ITEMS = subscriberStatusItems.map(({ key }) => key);

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
  sortDescriptor?: SortDescriptor;

  /** Filter options */
  subscriberStatusList: GQL.MailchimpSubscriberStatus[];
  optOut: boolean | null;
  warning: boolean | null;

  /** Has Filter control been specified */
  isFilterSpecified: boolean;
}>;

export const initialState: State = {
  audienceListId: undefined,
  searchText: undefined,
  sortDescriptor: undefined,
  subscriberStatusList: SUBSCRIBER_STATUS_ITEMS,
  optOut: null,
  warning: null,
  isFilterSpecified: false,
};

export type FilterT = Pick<
  State,
  'subscriberStatusList' | 'optOut' | 'warning'
>;
/**
 * Check if any of the filter controls have been specified
 *
 * - I.e. differ from inital state
 *
 * @param state
 */
export function isFilterSpecified(state: FilterT) {
  const filterProp = ['subscriberStatusList', 'optOut', 'warning'] as const;

  const res = !R.isDeepEqual(
    R.pick(state, filterProp),
    R.pick(initialState, filterProp)
  );
  return res;
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
      { payload }: PayloadAction<SortDescriptor | undefined>
    ) => {
      state.sortDescriptor = payload;
    },
    setFilter: (state, { payload }: PayloadAction<FilterT>) => {
      state.subscriberStatusList = payload.subscriberStatusList;
      state.optOut = payload.optOut;
      state.warning = payload.warning;
      state.isFilterSpecified = isFilterSpecified(state);
    },
  },
});
