import * as yup from 'yup';

/**
 * The schema needs to be different on the server side because
 * once the FileList get transferred to server side, it becomes
 * a File object
 */
export const schema = yup.object({
  communityId: yup.string().required(),
  xlsx: yup
    .mixed<File>()
    .required()
    .test('required', 'Please upload a valid xlsx file', (file) => {
      return file.size > 0;
    }),
});
export type InputData = (typeof schema)['__outputType'];
