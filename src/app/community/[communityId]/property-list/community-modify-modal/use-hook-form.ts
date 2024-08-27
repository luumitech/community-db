import { yupResolver } from '@hookform/resolvers/yup';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import * as yup from 'yup';
import {
  useForm,
  useFormContext,
  type UseFieldArrayReturn,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import { CommunityEntry } from '../_type';

export const ModifyFragment = graphql(/* GraphQL */ `
  fragment CommunityId_CommunityModifyModal on Community {
    id
    name
    eventList {
      name
      hidden
    }
    paymentMethodList {
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
    paymentMethodList: yup.array(
      yup.object({
        name: yup.string().required(),
      })
    ),
    // Used for rendering UI only, not submitted
    // to server
    hidden: yup.object({
      // list of events items that should be hidden
      eventList: yup.array(
        yup.object({
          name: yup.string().required(),
        })
      ),
      // list of payment methods items that should be hidden
      paymentMethodList: yup.array(
        yup.object({
          name: yup.string().required(),
        })
      ),
    }),
  });
}

export type InputData = ReturnType<typeof schema>['__outputType'];
type DefaultData = DefaultInput<InputData>;

function defaultInputData(fragment: CommunityEntry): DefaultData {
  const item = getFragment(ModifyFragment, fragment);

  return {
    self: {
      id: item.id,
      updatedAt: item.updatedAt,
    },
    name: item.name,
    eventList: item.eventList
      .filter((entry) => !entry.hidden)
      .map((entry) => ({ name: entry.name })),
    paymentMethodList: item.paymentMethodList
      .filter((entry) => !entry.hidden)
      .map((entry) => ({ name: entry.name })),
    hidden: {
      eventList: item.eventList
        .filter((entry) => !!entry.hidden)
        .map((entry) => ({ name: entry.name })),
      paymentMethodList: item.paymentMethodList
        .filter((entry) => !!entry.hidden)
        .map((entry) => ({ name: entry.name })),
    },
  };
}

export function useHookFormWithDisclosure(fragment: CommunityEntry) {
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
   * When modal is closed, reset form value with default values derived from
   * fragment
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

export type PaymentMethodListFieldArray = UseFieldArrayReturn<
  InputData,
  'paymentMethodList'
>;
export type HiddenPaymentMethodListFieldArray = UseFieldArrayReturn<
  InputData,
  'hidden.paymentMethodList'
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
