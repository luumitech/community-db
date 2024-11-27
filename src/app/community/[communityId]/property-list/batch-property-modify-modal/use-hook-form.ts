import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { getFragment, graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentYear } from '~/lib/date-util';
import { z, zz } from '~/lib/zod';
import { CommunityEntry } from '../_type';

const BatchPropertyModifyFragment = graphql(/* GraphQL */ `
  fragment CommunityId_BatchPropertyModifyModal on Community {
    id
    name
  }
`);

function schema() {
  return z.object({
    membership: z
      .object({
        year: z.coerce.number({ message: 'Must select a year' }),
        isMember: z.boolean(),
        eventAttendedList: z
          .array(
            z.object({
              eventName: zz.string.nonEmpty('Must specify a value'),
              eventDate: zz.coerce.toIsoDate(),
            })
          )
          .refine(
            (items) => {
              const eventNameList = items.map(({ eventName }) => eventName);
              return new Set(eventNameList).size === eventNameList.length;
            },
            { message: 'Event Name must be unique', path: [''] }
          ),
        paymentMethod: z.string(),
      })
      .refine(
        (form) => {
          if (form.eventAttendedList.length === 0) {
            return true;
          }
          return !!form.paymentMethod;
        },
        {
          message:
            'Must specify payment method to indicate how membership fee is processsed',
          path: ['paymentMethod'],
        }
      )
      .refine(
        (form) => {
          if (!form.paymentMethod) {
            return true;
          }
          return form.eventAttendedList.length > 0;
        },
        {
          message:
            'Must add at least one event when Payment Method is specified',
          path: ['eventAttendedList', ''],
        }
      ),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;
type DefaultData = DefaultInput<InputData>;

function defaultInputData(): DefaultData {
  return {
    membership: {
      year: getCurrentYear(),
      isMember: false,
      eventAttendedList: [],
      paymentMethod: '',
    },
  };
}

export function useHookFormWithDisclosure(community: CommunityEntry) {
  const defaultValues = React.useMemo(() => defaultInputData(), []);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });
  const { reset } = formMethods;

  React.useEffect(() => {
    // After form is submitted, update the form with new default
    reset(defaultValues);
  }, [reset, defaultValues]);

  /**
   * When modal is closed, reset form value with default values derived from
   * fragment
   */
  const onModalClose = React.useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);
  const disclosure = useDisclosure({
    onClose: onModalClose,
  });

  return { disclosure, formMethods, community };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

export function useHookFormContext() {
  return useFormContext<InputData>();
}
