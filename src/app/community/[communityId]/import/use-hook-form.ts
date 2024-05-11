import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';

export { useFieldArray } from 'react-hook-form';

export interface InputData {
  xlsx: FileList;
}

type DefaultData = DefaultInput<InputData>;

function defaultInputData(): DefaultData {
  return {
    xlsx: [] as unknown as FileList,
  };
}

function validationResolver() {
  const schema = yup.object().shape({
    xlsx: yup
      .mixed<FileList>()
      .required()
      .test(
        'required',
        'Please upload a valid xlsx file',
        (files?: FileList) => !!files?.length
      ),
  });
  return yupResolver(schema);
}

export function useHookForm() {
  return useForm<InputData>({
    defaultValues: defaultInputData(),
    resolver: validationResolver(),
  });
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
