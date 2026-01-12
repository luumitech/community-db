import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import { initialState, isFilterSpecified } from '~/lib/reducers/search-bar';
import { z, zz } from '~/lib/zod';

function schema() {
  return z.object({
    memberYearList: zz.coerce.toNumberList(),
    nonMemberYearList: zz.coerce.toNumberList(),
    memberEventList: zz.coerce.toStringList(),
    withGps: zz.coerce.toBoolean({ nullable: true }),
  });
}

export type InputData = z.infer<ReturnType<typeof schema>>;

export function useHookForm() {
  const searchBar = useSelector((state) => state.searchBar);
  const defaultValues = React.useMemo(
    () => searchBar.filter,
    [searchBar.filter]
  );
  const formMethods = useForm({
    defaultValues,
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
    const { memberYearList, nonMemberYearList, memberEventList, withGps } =
      initialState.filter;
    setValue('memberYearList', memberYearList, { shouldDirty: true });
    setValue('nonMemberYearList', nonMemberYearList, { shouldDirty: true });
    setValue('memberEventList', memberEventList, { shouldDirty: true });
    setValue('withGps', withGps, { shouldDirty: true });
  }, [setValue]);

  return { formMethods, canReset, reset };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
