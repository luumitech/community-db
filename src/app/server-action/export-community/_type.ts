import * as yup from 'yup';

export const schema = yup.object({
  email: yup.string().required('You are not authorized'),
  communityId: yup.string().required(),
});
export type InputData = (typeof schema)['__outputType'];
