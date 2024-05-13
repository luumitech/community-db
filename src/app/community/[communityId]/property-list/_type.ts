import { MemberShipFragmentType } from './membership';
import { OccupantFragmentType } from './occupant';
import { PropertyAddressFragmentType } from './property-address';

export type PropertyEntry = PropertyAddressFragmentType &
  OccupantFragmentType &
  MemberShipFragmentType;
