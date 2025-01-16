import { Input, InputProps } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useFilterBarContext } from '~/community/[communityId]/filter-context';
import { useAppContext } from '~/custom-hooks/app-context';
import { FormProvider } from '~/custom-hooks/hook-form';
import { FlatButton } from '~/view/base/flat-button';
import { Icon } from '~/view/base/icon';
import { FilterButton } from './filter-button';
import { FilterChip } from './filter-chip';
import { FilterDrawer } from './filter-drawer';
import { useHookFormWithDisclosure, type InputData } from './use-hook-form';

interface Props extends InputProps {
  className?: string;
  onChange?: () => void;
}

export const PropertySearchBar: React.FC<Props> = ({
  className,
  onChange,
  ...props
}) => {
  const { communityUi } = useAppContext();
  const { disclosure, formMethods } = useHookFormWithDisclosure();
  const { memberYear, nonMemberYear, event } = useFilterBarContext();

  const setSearchText = (input?: string) => {
    communityUi.actions.setPropertyListSearch(input);
    onChange?.();
  };

  const onFilterChange = React.useCallback(
    async (input: InputData) => {
      memberYear.clear();
      memberYear.add(input.memberYear);
      nonMemberYear.clear();
      nonMemberYear.add(input.nonMemberYear);
      event.clear();
      event.add(input.event);
      onChange?.();
    },
    [memberYear, nonMemberYear, event, onChange]
  );

  return (
    <FormProvider {...formMethods}>
      <Input
        className={className}
        placeholder="Search Address or Member Name"
        startContent={<Icon icon="search" />}
        // isClearable
        // onClear={() => setSearchText(undefined)}
        endContent={
          <div className="flex items-center justify-center gap-2">
            {/**
             * `isClearable`/`onClear` cannot be used together with endContent See:
             * https://github.com/nextui-org/nextui/issues/2254
             */}
            <FlatButton
              icon="cross"
              disabled={!communityUi.propertyListSearch}
              onClick={() => setSearchText(undefined)}
            />
            <FilterButton disclosure={disclosure} />
            <FilterChip disclosure={disclosure} onChange={onFilterChange} />
          </div>
        }
        // endContent={
        //   <div className="pointer-events-none flex items-center">
        //     <span className="text-default-400 text-small">.org/</span>
        //   </div>
        // }
        value={communityUi.propertyListSearch ?? ''}
        onValueChange={setSearchText}
        {...props}
      />
      <FilterDrawer disclosure={disclosure} onChange={onFilterChange} />
    </FormProvider>
  );
};
