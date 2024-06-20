import { type EventFragmentType } from './event-participation';
import { type MemberCountFragmentType } from './member-count-chart';
import { type MembershipSourceFragmentType } from './membership-source';

export type DashboardEntry = EventFragmentType &
  MemberCountFragmentType &
  MembershipSourceFragmentType;
