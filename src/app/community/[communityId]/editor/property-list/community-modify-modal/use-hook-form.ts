import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';

function schema() {
  return yup.object({
    self: yup.object({
      id: yup.string().required(),
      updatedAt: yup.string().required(),
    }),
    name: yup.string().required(),
    eventList: yup.array(yup.string().required()).required(),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

const EntryFragment = graphql(/* GraphQL */ `
  fragment CommunityId_CommunityModifyModal on Community {
    id
    name
    eventList
    updatedAt
    updatedBy
  }
`);

export const CommunityMutation = graphql(/* GraphQL */ `
  mutation communityModify($input: CommunityModifyInput!) {
    communityModify(input: $input) {
      ...CommunityId_CommunityModifyModal
    }
  }
`);

function defaultInputData(
  item: GQL.CommunityId_CommunityModifyModalFragment
): DefaultData {
  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    name: item.name,
    eventList: item.eventList,
  };
}

export function useHookFormWithDisclosure(
  entry: FragmentType<typeof EntryFragment>
) {
  const fragment = useFragment(EntryFragment, entry);
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

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
