import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import * as GQL from '~/graphql/generated/graphql';

export { useFieldArray } from 'react-hook-form';

export interface InputData extends Omit<GQL.PropertyModifyInput, 'self'> {}
type DefaultData = DefaultInput<InputData>;

function defaultInputData(item: GQL.PropertyId_EditorFragment): DefaultData {
  return {
    notes: item.notes ?? '',
    occupantList: item.occupantList.map((entry) => ({
      firstName: entry.firstName ?? '',
      lastName: entry.lastName ?? '',
      optOut: entry.optOut ?? false,
      email: entry.email ?? '',
      cell: entry.cell ?? '',
      work: entry.work ?? '',
      home: entry.home ?? '',
    })),
  };
}

function validationResolver() {
  const schema = yup.object().shape({
    notes: yup.string().nullable(),
    occupantList: yup
      .array(
        yup.object().shape({
          firstName: yup.string().nullable(),
          lastName: yup.string().nullable(),
          optOut: yup.boolean().nullable(),
          email: yup.string().nullable(),
          cell: yup.string().nullable(),
          work: yup.string().nullable(),
          home: yup.string().nullable(),
        })
      )
      .required(),
  });
  return yupResolver(schema);
}

export function useHookForm(defaultValues: GQL.PropertyId_EditorFragment) {
  return useForm<InputData>({
    defaultValues: defaultInputData(defaultValues),
    resolver: validationResolver(),
  });
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
