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

const OccupancyEditorOccupantFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupancyEditor_Occupant on Occupant {
    firstName
    lastName
    optOut
    infoList {
      type
      label
      value
    }
  }
`);

const OccupancyEditorFragment = graphql(/* GraphQL */ `
  fragment PropertyId_OccupancyEditor on Property {
    id
    updatedAt
    updatedBy {
      ...User
    }
    # This is necessary so the occupantList cache will be updated correctly
    occupantList {
      ...PropertyId_OccupancyEditor_Occupant
    }
    occupancyInfoList {
      startDate
      endDate
      occupantList {
        ...PropertyId_OccupancyEditor_Occupant
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
    occupancyInfoList: z.array(
      z.object({
        startDate: zz.coerce.toIsoDate({ nullable: true }),
        endDate: zz.coerce.toIsoDate({ nullable: true }),
        occupantList: occupantListSchema,
      })
    ),
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
    occupancyInfoList: item.occupancyInfoList.map((entry) => ({
      startDate: entry.startDate ?? null,
      endDate: entry.endDate ?? null,
      occupantList: entry.occupantList.map((occupantFragment) => {
        const occupant = getFragment(
          OccupancyEditorOccupantFragment,
          occupantFragment
        );
        return {
          firstName: occupant.firstName ?? occupantDefault.firstName,
          lastName: occupant.lastName ?? occupantDefault.lastName,
          optOut: occupant.optOut ?? occupantDefault.optOut,
          infoList: (occupant.infoList ?? occupantDefault.infoList).map(
            ({ type, label, value }) => ({ type, label, value })
          ),
        };
      }),
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
