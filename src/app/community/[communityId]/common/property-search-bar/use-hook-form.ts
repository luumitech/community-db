import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@nextui-org/react';
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

export function useHookFormWithDisclosure() {
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
  const { reset } = formMethods;

  React.useEffect(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);

  /** When drawer is closed, reset form value with default values */
  const onDrawerClose = React.useCallback(() => {
    reset(defaultValues);
  }, [reset, defaultValues]);
  const disclosure = useDisclosure({
    onClose: onDrawerClose,
  });

  return { disclosure, formMethods };
}

export type UseHookFormWithDisclosureResult = ReturnType<
  typeof useHookFormWithDisclosure
>;

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
