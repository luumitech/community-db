import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import {
  UseFieldArrayReturn,
  useForm,
  useFormContext,
} from '~/custom-hooks/hook-form';
import { graphql, useFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
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
  return yup.object({
    self: yup.object({
      id: yup.string().required(),
      updatedAt: yup.string().required(),
    }),
    occupantList: yup.array(
      yup.object({
        firstName: yup.string().nullable(),
        lastName: yup.string().nullable(),
        optOut: yup.boolean().nullable(),
        email: yup.string().nullable(),
        cell: yup.string().nullable(),
        work: yup.string().nullable(),
        home: yup.string().nullable(),
      })
    ),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
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

function defaultInputData(fragment: PropertyEntry): DefaultData {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const item = useFragment(OccupantEditorFragment, fragment);

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
   * When modal is closed, reset form value with
   * default values derived from fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultInputData(fragment));
  }, [reset, fragment]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
