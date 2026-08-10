import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import {
  initialState,
  isFilterSpecified,
  type FilterT,
} from '~/lib/reducers/search-bar';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    memberYearList: zz.coerce.toNumberList(),
    nonMemberYearList: zz.coerce.toNumberList(),
    memberEventList: zz.coerce.toStringList(),
    ticketList: zz.coerce.toStringList(),
    withGps: zz.coerce.toBoolean({ nullable: true }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export interface HookFormArg {
  /**
   * Filters to show in the drawer
   *
   * I.e. ['memberYearList', 'nonMemberYearList', 'memberEventList',
   * 'ticketList']
   */
  filtersToShow: (keyof FilterT)[];
  /** Default filter state when drawer is first opened */
  defaultState: FilterT;
}

export function useHookForm(arg: HookFormArg) {
  const { filtersToShow, defaultState } = arg;
  const formMethods = useForm({
    defaultValues: defaultState,
    resolver: zodResolver(schema()),
  });
  const { setValue, watch } = formMethods;
  const formValues = watch();

  /** Check if the form can be reset to its original state */
  const canReset = React.useMemo(() => {
    const result = schema().safeParse(formValues);
    if (!result.success) {
      return true;
    }
    return isFilterSpecified(result.data);
  }, [formValues]);

  const reset = React.useCallback(() => {
    const {
      memberYearList,
      nonMemberYearList,
      memberEventList,
      ticketList,
      withGps,
    } = initialState.filter;
    if (filtersToShow.includes('memberEventList')) {
      setValue('memberYearList', memberYearList, { shouldDirty: true });
    }
    if (filtersToShow.includes('nonMemberYearList')) {
      setValue('nonMemberYearList', nonMemberYearList, { shouldDirty: true });
    }
    if (filtersToShow.includes('memberEventList')) {
      setValue('memberEventList', memberEventList, { shouldDirty: true });
    }
    if (filtersToShow.includes('ticketList')) {
      setValue('ticketList', ticketList, { shouldDirty: true });
    }
    if (filtersToShow.includes('withGps')) {
      setValue('withGps', withGps, { shouldDirty: true });
    }
  }, [filtersToShow, setValue]);

  return { formMethods, canReset, reset };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
