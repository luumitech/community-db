import { type FragmentType } from '~/graphql/generated';
import { UserFragment } from './user-name';

export type UserFragmentType = FragmentType<typeof UserFragment>;
