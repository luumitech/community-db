import { type ActionFragmentType } from './action';
import { type RoleInfoFragmentType } from './role-info';
import { type UserInfoFragmentType } from './user-info';

export type AccessEntry = RoleInfoFragmentType &
  UserInfoFragmentType &
  ActionFragmentType;
