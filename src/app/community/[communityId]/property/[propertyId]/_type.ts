import { type MembershipDisplayFragmentType } from './membership-display';
import { type MembershipEditorFragmentType } from './membership-editor/use-hook-form';
import { type OccupantDisplayFragmentType } from './occupant-display';
import { type OccupantEditorFragmentType } from './occupant-editor/use-hook-form';
import { type PropertyDisplayFragmentType } from './property-display';

export type PropertyEntry = MembershipDisplayFragmentType &
  MembershipEditorFragmentType &
  OccupantDisplayFragmentType &
  OccupantEditorFragmentType &
  PropertyDisplayFragmentType;
