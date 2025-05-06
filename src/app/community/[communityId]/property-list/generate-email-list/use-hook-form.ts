import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import * as GQL from '~/graphql/generated/graphql';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    /** Community ID */
    id: zz.string.nonEmpty(),
    filter: z.object({
      memberYear: zz.coerce.toNumber({
        message: 'Must select a year',
        nullable: true,
      }),
      nonMemberYear: zz.coerce.toNumber({
        message: 'Must select a year',
        nullable: true,
      }),
      memberEvent: z.string().nullable(),
    }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  communityId: string,
  filter: GQL.PropertyFilterInput
): InputData {
  return {
    id: communityId,
    filter: {
      memberYear: filter.memberYear ?? null,
      nonMemberYear: filter.nonMemberYear ?? null,
      memberEvent: filter.memberEvent ?? null,
    },
  };
}

export function useHookForm(communityId: string) {
  const { filterArg } = useSelector((state) => state.searchBar);
  const defaultValues = React.useMemo(
    () => defaultInputData(communityId, filterArg),
    [communityId, filterArg]
  );
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods, communityId };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
