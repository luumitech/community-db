import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';

export interface InputData {
  communityId: string;
  xlsx: FileList;
}

type DefaultData = DefaultInput<InputData>;

function defaultInputData(communityId: string): DefaultData {
  return {
    communityId,
    xlsx: [] as unknown as FileList,
  };
}

function validationResolver() {
  const schema = yup.object({
    communityId: yup.string().required(),
    xlsx: yup
      .mixed<FileList>()
      .required()
      .test('required', 'Please upload a valid xlsx file', (files) => {
        return files.length > 0;
      }),
  });
  return yupResolver(schema);
}

export function useHookForm(communityId: string) {
  const defaultValues = defaultInputData(communityId);
  const formMethods = useForm({
    defaultValues,
    resolver: validationResolver(),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
