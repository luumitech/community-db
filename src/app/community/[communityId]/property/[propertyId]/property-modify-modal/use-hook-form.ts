import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import { PropertyEntry } from '../_type';

export const PropertyEditorFragment = graphql(/* GraphQL */ `
  fragment PropertyId_PropertyEditor on Property {
    id
    updatedAt
    updatedBy {
      ...User
    }
    address
    streetNo
    streetName
    postalCode
  }
`);

export const PropertyMutation = graphql(/* GraphQL */ `
  mutation propertyModify($input: PropertyModifyInput!) {
    propertyModify(input: $input) {
      ...PropertyId_PropertyEditor
    }
  }
`);

function schema() {
  return yup.object({
    self: yup.object({
      id: yup.string().required(),
      updatedAt: yup.string().required(),
    }),
    address: yup.string(),
    streetNo: yup.string(),
    streetName: yup.string(),
    postalCode: yup.string(),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(fragment: PropertyEntry): DefaultData {
  const item = getFragment(PropertyEditorFragment, fragment);

  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    address: item.address,
    streetNo: item.streetNo ?? '',
    streetName: item.streetName ?? '',
    postalCode: item.postalCode ?? '',
  };
}

export function useHookFormWithDisclosure(fragment: PropertyEntry) {
  const formMethods = useForm({
    defaultValues: defaultInputData(fragment),
    resolver: yupResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultInputData(fragment));
  }, [reset, fragment]);

  /**
   * When modal is closed, reset form value with default values derived from
   * fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultInputData(fragment));
  }, [reset, fragment]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods, fragment };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
