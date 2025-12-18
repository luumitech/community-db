import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm, useFormContext } from '~/custom-hooks/hook-form';
import { type RootState } from '~/lib/reducers';
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

function defaultFilterInputData(searchBar: RootState['searchBar']): InputData {
  return {
    memberYearList: searchBar.memberYearList,
    nonMemberYearList: searchBar.nonMemberYearList,
    memberEventList: searchBar.memberEventList,
    withGps: searchBar.withGps,
  };
}

export function useHookForm(searchBar: RootState['searchBar']) {
  const defaultValues = React.useMemo(() => {
    return defaultFilterInputData(searchBar);
  }, [searchBar]);
  const formMethods = useForm({
    defaultValues,
    resolver: zodResolver(schema()),
  });

  return { formMethods };
}

export function useHookFormContext() {
  return useFormContext<InputData>();
}
