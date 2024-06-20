import { type DeleteFragmentType } from './action/remove-access';
import { type ModifyFragmentType } from './modify-access-modal/use-hook-form';
import { type RoleInfoFragmentType } from './role-info';
import { type UserInfoFragmentType } from './user-info';

export { ModifyFragment } from './modify-access-modal/use-hook-form';
export { UserInfoFragment } from './user-info';

export type AccessEntry = {
  // Added after otherAccessList is retrieved, to
  // indicate if the access entry is owned by context user
  isSelf?: boolean;
} & DeleteFragmentType &
  ModifyFragmentType &
  RoleInfoFragmentType &
  UserInfoFragmentType;
