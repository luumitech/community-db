import { type Dashboard_EventMembershipFragment } from '~/graphql/generated/graphql';

export type EventMembershipFragment = Dashboard_EventMembershipFragment;
export type EventStat = EventMembershipFragment['communityStat']['eventStat'];
export type MembershipStat = EventStat[0]['membershipList'][0] & {
  eventName: string;
};
