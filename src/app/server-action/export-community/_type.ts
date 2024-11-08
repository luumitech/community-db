import { z, zNonEmptyStr } from '~/lib/zod';

export const schema = z.object({
  email: zNonEmptyStr({ message: 'You are not authorized' }),
  communityId: zNonEmptyStr(),
});
export type InputData = z.infer<typeof schema>;
