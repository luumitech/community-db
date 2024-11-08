import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import {
  useForm,
  useFormContext,
  type UseFieldArrayReturn,
} from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import { z, zNonEmptyStr } from '~/lib/zod';
import { CommunityEntry } from '../_type';

const ModifyFragment = graphql(/* GraphQL */ `
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

function schema() {
  return z.object({
    self: z.object({
      id: zNonEmptyStr(),
      updatedAt: zNonEmptyStr(),
    }),
    name: zNonEmptyStr(),
    eventList: z.array(
      z.object({
        name: zNonEmptyStr(),
      })
    ),
    paymentMethodList: z.array(
      z.object({
        name: zNonEmptyStr(),
      })
    ),
    // Used for rendering UI only, not submitted
    // to server
    hidden: z.object({
      // list of events items that should be hidden
      eventList: z.array(
        z.object({
          name: zNonEmptyStr(),
        })
      ),
      // list of payment methods items that should be hidden
      paymentMethodList: z.array(
        z.object({
          name: zNonEmptyStr(),
        })
      ),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
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
  const community = getFragment(ModifyFragment, fragment);
  const formMethods = useForm({
    defaultValues: defaultInputData(fragment),
    resolver: zodResolver(schema()),
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

  return { disclosure, formMethods, community };
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
