import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { z } from '~/lib/zod';

function schema() {
  return z.object({
    memberYear: z.string(),
    nonMemberYear: z.string(),
    event: z.string(),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

function defaultInputData(
  memberYear?: string,
  nonMemberYear?: string,
  event?: string
): InputData {
  return {
    memberYear: memberYear ?? '',
    nonMemberYear: nonMemberYear ?? '',
    event: event ?? '',
  };
}

export function useHookForm() {
  const { memberYear, nonMemberYear, event } = useFilterBarContext();
  const [memberYearStr] = memberYear;
  const [nonMemberYearStr] = nonMemberYear;
  const [eventStr] = event;
  const defaultValues = React.useMemo(() => {
    return defaultInputData(memberYearStr, nonMemberYearStr, eventStr);
  }, [memberYearStr, nonMemberYearStr, eventStr]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}

/** Custom hook to check if filter has been specified */
export function useIsFilterSpecified() {
  const { watch } = useHookFormContext();
  const memberYear = watch('memberYear');
  const nonMemberYear = watch('nonMemberYear');
  const event = watch('event');

  /** Has Filter been specified */
  const filterSpecified = React.useMemo(() => {
    return !!memberYear || !!nonMemberYear || !!event;
  }, [memberYear, nonMemberYear, event]);
  return { filterSpecified, memberYear, nonMemberYear, event };
}
