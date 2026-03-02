import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import {
  useForm,
  useFormContext,
  type UseFieldArrayReturn,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql, type FragmentType } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';
import { useLayoutContext } from '../../layout-context';

export { useFieldArray } from '~/custom-hooks/hook-form';

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
      moveInDate
      moveOutDate
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
        moveInDate: zz.coerce.toIsoDate({ nullable: true }),
        moveOutDate: zz.coerce.toIsoDate({ nullable: true }),
        occupantList: z.array(
          z.object({
            firstName: z.string(),
            lastName: z.string(),
            optOut: z.boolean(),
            infoList: z.array(
              z
                .object({
                  type: z.nativeEnum(GQL.ContactInfoType),
                  label: zz.string.nonEmpty('Must specify a label'),
                  value: zz.string.nonEmpty('Must specify a value'),
                })
                .superRefine((form, ctx) => {
                  switch (form.type) {
                    case GQL.ContactInfoType.Email:
                      if (!z.string().email().safeParse(form.value).success) {
                        return ctx.addIssue({
                          code: z.ZodIssueCode.custom,
                          message: 'Invalid email',
                          path: ['value'],
                        });
                      }
                      break;

                    case GQL.ContactInfoType.Phone:
                      break;

                    default:
                      break;
                  }
                })
            ),
          })
        ),
      })
    ),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
export type OccupancyInfoEntry = InputData['occupancyInfoList'][number];
export type OccupantEntry = OccupancyInfoEntry['occupantList'][number];

export const occupantDefault: InputData['occupancyInfoList'][number]['occupantList'][number] =
  {
    firstName: '',
    lastName: '',
    optOut: false,
    infoList: [],
  };

export const occupancyInfoDefault: InputData['occupancyInfoList'][number] = {
  moveInDate: null,
  moveOutDate: null,
  occupantList: [],
};

function defaultInputData(
  item: GQL.PropertyId_OccupancyEditorFragment
): InputData {
  const occupancyInfoList =
    item.occupancyInfoList.length === 0
      ? // Always provide at least a default set of occupancy information
        [occupancyInfoDefault]
      : item.occupancyInfoList.map((entry) => ({
          moveInDate: entry.moveInDate ?? null,
          moveOutDate: entry.moveOutDate ?? null,
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
        }));

  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    occupancyInfoList,
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

export type OccupancyInfoListFieldArray = UseFieldArrayReturn<
  InputData,
  'occupancyInfoList'
>;

export type OccupantListFieldArray = UseFieldArrayReturn<
  InputData,
  `occupancyInfoList.${number}.occupantList`
>;
