import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  occupantDefault,
  occupantListSchema,
} from '~/community/[communityId]/common/occupancy-editor/use-hook-form';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { useLayoutContext } from '../../layout-context';

const OccupancyEditorFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupancyEditor on Property {
    id
    updatedAt
    updatedBy {
      ...User
    }
    occupantStartDate
    occupantList {
      firstName
      lastName
      optOut
      infoList {
        type
        label
        value
      }
    }
  }
`);
export type OccupancyEditorFragmentType = FragmentType<
  typeof OccupancyEditorFragment
>;

function schema() {
  return z.object({
    self: z.object({
      id: zz.string.nonEmpty(),
      updatedAt: zz.string.nonEmpty(),
    }),
    occupantStartDate: zz.coerce.toIsoDate({ nullable: true }),
    occupantList: occupantListSchema,
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  item: GQL.PropertyId_OccupancyEditorFragment
): InputData {
  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    occupantStartDate: item.occupantStartDate ?? null,
    occupantList: item.occupantList.map((entry) => ({
      firstName: entry.firstName ?? occupantDefault.firstName,
      lastName: entry.lastName ?? occupantDefault.lastName,
      optOut: entry.optOut ?? occupantDefault.optOut,
      infoList: (entry.infoList ?? occupantDefault.infoList).map(
        ({ type, label, value }) => ({ type, label, value })
      ),
    })),
  };
}

export function useHookForm() {
  const { property: fragment } = useLayoutContext();
  const property = getFragment(OccupancyEditorFragment, fragment);
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
