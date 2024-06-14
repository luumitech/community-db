import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import {
  useForm,
  useFormContext,
  type UseFieldArrayReturn,
} from '~/custom-hooks/hook-form';
import { FragmentType, graphql, useFragment } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';

function schema() {
  return yup.object({
    self: yup.object({
      id: yup.string().required(),
      updatedAt: yup.string().required(),
    }),
    name: yup.string().required(),
    eventList: yup.array(
      yup.object({
        name: yup.string().required(),
      })
    ),
    // Used for rendering UI only, not submitted
    // to server
    hidden: yup.object({
      eventList: yup.array(
        yup.object({
          name: yup.string().required(),
        })
      ),
    }),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

const EntryFragment = graphql(/* GraphQL */ `
  fragment CommunityId_CommunityModifyModal on Community {
    id
    name
    eventList {
      name
      hidden
    }
    updatedAt
    updatedBy {
      ...User
    }
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
    eventList: item.eventList
      .filter((event) => !event.hidden)
      .map((event) => ({ name: event.name })),
    hidden: {
      eventList: item.eventList
        .filter((event) => !!event.hidden)
        .map((event) => ({ name: event.name })),
    },
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

  return { disclosure, formMethods, fragment };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export type EventListFieldArray = UseFieldArrayReturn<InputData, 'eventList'>;
export type HiddenEventListFieldArray = UseFieldArrayReturn<
  InputData,
  'hidden.eventList'
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
