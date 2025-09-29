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
      infoList {
        type
        label
        value
      }
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
  infoList: [],
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
      email: occupantDefault.email,
      cell: occupantDefault.cell,
      work: occupantDefault.work,
      home: occupantDefault.home,
      infoList: (entry.infoList ?? occupantDefault.infoList).map(
        ({ type, label, value }) => ({ type, label, value })
      ),
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
