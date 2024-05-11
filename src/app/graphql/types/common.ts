import { builder } from '../builder';

/**
 * 'self' argument for all update mutations
 */
export const UpdateInput = builder.inputType('UpdateInput', {
  fields: (t) => ({
    id: t.id({ required: true }),
  }),
});
