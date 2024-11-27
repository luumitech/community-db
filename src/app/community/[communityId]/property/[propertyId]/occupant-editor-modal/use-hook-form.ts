import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { type PropertyEntry } from '../_type';

const OccupantEditorFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupantEditor on Property {
    id
    updatedAt
    updatedBy {
      ...User
    }
    occupantList {
      firstName
      lastName
      optOut
      email
      cell
      work
      home
    }
  }
`);

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    occupantList: z.array(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        optOut: z.boolean(),
        email: z.string(),
        cell: z.string(),
        work: z.string(),
        home: z.string(),
      })
    ),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
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

function defaultInputData(
  item: GQL.PropertyId_OccupantEditorFragment
): DefaultData {
  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
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

export function useHookFormWithDisclosure(fragment: PropertyEntry) {
  const property = getFragment(OccupantEditorFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(property),
    [property]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultValues);
  }, [reset, defaultValues]);

  /**
   * When modal is closed, reset form value with default values derived from
   * fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);
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
