import { z, zz } from '~/lib/zod';

export enum ExportMethod {
  Multisheet = 'multisheet',
  Singlesheet = 'lcradb',
}

export const schema = z.object({
  email: zz.string.nonEmpty('You are not authorized'),
  communityId: zz.string.nonEmpty(),
  exportMethod: z.nativeEnum(ExportMethod),
});
export type InputData = z.infer<typeof schema>;
