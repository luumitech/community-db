import { z, zz } from '~/lib/zod';

export const schema = z.object({
  email: zz.string.nonEmpty('You are not authorized'),
  communityId: zz.string.nonEmpty(),
});
export type InputData = z.infer<typeof schema>;
