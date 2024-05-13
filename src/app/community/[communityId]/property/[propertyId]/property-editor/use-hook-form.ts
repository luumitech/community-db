import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import * as GQL from '~/graphql/generated/graphql';

export { useFieldArray } from 'react-hook-form';

export interface InputData extends Pick<GQL.PropertyModifyInput, 'notes'> {}
type DefaultData = DefaultInput<InputData>;

function defaultInputData(
  item: GQL.PropertyId_PropertyEditorFragment
): DefaultData {
  return {
    notes: item.notes ?? '',
  };
}

function validationResolver() {
  const schema = yup.object().shape({
    notes: yup.string().nullable(),
  });
  return yupResolver(schema);
}

export function useHookForm(fragment: GQL.PropertyId_PropertyEditorFragment) {
  return useForm<InputData>({
    defaultValues: defaultInputData(fragment),
    resolver: validationResolver(),
    mode: 'onBlur',
  });
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
