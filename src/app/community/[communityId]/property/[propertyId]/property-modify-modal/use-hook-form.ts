import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import { z, zNonEmptyStr } from '~/lib/zod';
import { PropertyEntry } from '../_type';

const PropertyEditorFragment = graphql(/* GraphQL */ `
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

function schema() {
  return z.object({
    self: z.object({
      id: zNonEmptyStr(),
      updatedAt: zNonEmptyStr(),
    }),
    address: zNonEmptyStr(),
    streetNo: zNonEmptyStr(),
    streetName: zNonEmptyStr(),
    postalCode: z.string(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
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
  const property = getFragment(PropertyEditorFragment, fragment);
  const formMethods = useForm({
    defaultValues: defaultInputData(fragment),
    resolver: zodResolver(schema()),
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

  return { disclosure, formMethods, property };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
