import { type CommunityDeleteFragmentType } from './community-delete-modal';
import { type CommunityModifyFragmentType } from './community-modify-modal/use-hook-form';
import { type MemberShipFragmentType } from './membership';
import { type OccupantFragmentType } from './occupant';
import { type PropertyAddressFragmentType } from './property-address';

export { DeleteFragment } from './community-delete-modal';
export { ModifyFragment } from './community-modify-modal/use-hook-form';

export type CommunityEntry = {
  // id is always queried
  id: string;
} & CommunityDeleteFragmentType &
  CommunityModifyFragmentType;

export type PropertyEntry = MemberShipFragmentType &
  OccupantFragmentType &
  PropertyAddressFragmentType;
