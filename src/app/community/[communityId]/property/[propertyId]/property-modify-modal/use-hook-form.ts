import { useDisclosure } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

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
export type PropertyEditorFragmentType = FragmentType<
  typeof PropertyEditorFragment
>;

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    address: zz.string.nonEmpty(),
    streetNo: z.coerce.number({ message: 'Must be a number' }).int().nullable(),
    streetName: zz.string.nonEmpty(),
    postalCode: z.string(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  item: GQL.PropertyId_PropertyEditorFragment
): InputData {
  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    address: item.address,
    streetNo: item.streetNo ?? null,
    streetName: item.streetName ?? '',
    postalCode: item.postalCode ?? '',
  };
}

export function useHookFormWithDisclosure(
  fragment: PropertyEditorFragmentType
) {
  const property = getFragment(PropertyEditorFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(property),
    [property]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  /**
   * When modal is open, sync form value with latest default values derived from
   * fragment
   */
  const onModalOpen = React.useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);
  const disclosure = useDisclosure({
    onOpen: onModalOpen,
  });

  return { disclosure, formMethods, property };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
