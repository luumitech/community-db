import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { parseAsNumber } from '~/lib/number-util';
import { z, zz } from '~/lib/zod';
import { useLayoutContext } from '../layout-context';

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
    city
    country
    lat
    lon
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
    streetNo: zz.coerce.toNumber({ nullable: true }),
    streetName: zz.string.nonEmpty(),
    postalCode: z.string(),
    city: z.string(),
    country: z.string(),
    lat: zz.coerce.toNumber({ nullable: true }),
    lon: zz.coerce.toNumber({ nullable: true }),
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
    city: item.city ?? '',
    country: item.country ?? '',
    lat: parseAsNumber(item.lat),
    lon: parseAsNumber(item.lon),
  };
}

export function useHookForm() {
  const { property: fragment } = useLayoutContext();
  const property = getFragment(PropertyEditorFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(property),
    [property]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, property };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
