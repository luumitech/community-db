import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { useLayoutContext } from '../../layout-context';

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
export type OccupantEditorFragmentType = FragmentType<
  typeof OccupantEditorFragment
>;

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

export type OccupantFieldArrayReturn = UseFieldArrayReturn<
  InputData,
  'occupantList',
  'id'
>;

export const occupantDefault: InputData['occupantList'][number] = {
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
): InputData {
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

export function useHookForm() {
  const { property: fragment } = useLayoutContext();
  const property = getFragment(OccupantEditorFragment, fragment);
  const defaultValues = React.useMemo(
    () => defaultInputData(property),
    [property]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
