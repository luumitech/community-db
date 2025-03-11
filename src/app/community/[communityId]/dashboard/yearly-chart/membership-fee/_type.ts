import { type Dashboard_EventMembershipFragment } from '~/graphql/generated/graphql';

export type EventMembershipFragment = Dashboard_EventMembershipFragment;
export type MembershipFeeStat =
  EventMembershipFragment['communityStat']['membershipFeeStat'];
export type MembershipFeeStatEntry = Omit<MembershipFeeStat[0], '__typename'>;
