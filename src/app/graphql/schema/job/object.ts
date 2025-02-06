import { GraphQLError } from 'graphql';
import { builder } from '~/graphql/builder';

export interface JobPayload {
  id: string;
}

export const jobPayloadRef = builder
  .objectRef<JobPayload>('JobPayload')
  .implement({
    fields: (t) => ({
      id: t.exposeID('id'),
    }),
  });
