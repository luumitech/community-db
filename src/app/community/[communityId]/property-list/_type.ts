import { type CommunityFromIdQuery } from '~/graphql/generated/graphql';

export { DeleteFragment } from './community-delete-modal';
export { ModifyFragment } from './community-modify-modal/use-hook-form';

export type CommunityEntry = CommunityFromIdQuery['communityFromId'];
export type PropertyEntry = CommunityEntry['propertyList']['edges'][0]['node'];
