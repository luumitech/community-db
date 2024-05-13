import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { UseFieldArrayReturn, useForm, useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import * as GQL from '~/graphql/generated/graphql';

export { useFieldArray } from 'react-hook-form';

export interface InputData
  extends Pick<GQL.PropertyModifyInput, 'occupantList'> {}
type DefaultData = DefaultInput<InputData>;

export type OccupantFieldArrayReturn = UseFieldArrayReturn<
  InputData,
  'occupantList',
  'id'
>;

export const occupantDefault: DefaultInput<GQL.OccupantInput> = {
  firstName: '',
  lastName: '',
  optOut: false,
  email: '',
  cell: '',
  work: '',
  home: '',
};

function defaultInputValue(
  item: GQL.PropertyId_OccupantEditorFragment
): DefaultData {
  return {
    occupantList: item.occupantList.map((entry) => ({
      firstName: entry.firstName ?? occupantDefault.firstName,
      lastName: entry.lastName ?? occupantDefault.lastName,
      optOut: entry.optOut ?? occupantDefault.optOut,
      email: entry.email ?? occupantDefault.email,
      cell: entry.cell ?? occupantDefault.cell,
      work: entry.work ?? occupantDefault.work,
      home: entry.home ?? occupantDefault.home,
    })),
  };
}

function validationResolver() {
  const schema = yup.object().shape({
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
      .nullable(),
  });
  return yupResolver(schema);
}

export function useHookFormWithDisclosure(
  fragment: GQL.PropertyId_OccupantEditorFragment
) {
  const defaultValues = defaultInputValue(fragment);
  const formMethods = useForm<InputData>({
    defaultValues,
    resolver: validationResolver(),
  });
  const { reset } = formMethods;
  /**
   * When modal is closed, reset form value with
   * default values derived from fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
