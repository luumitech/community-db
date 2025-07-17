import { cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem } from '~/view/base/select';

interface Props {
  className?: string;
}

export const BatchModifyMethodSelect: React.FC<Props> = ({ className }) => {
  const { hasGeoapifyApiKey } = useLayoutContext();

  const methodItems = React.useMemo(
    () => [
      {
        label: 'Add an event or update membership',
        value: GQL.BatchModifyMethod.AddEvent,
      },
      {
        label: 'Update GPS Information for properties',
        value: GQL.BatchModifyMethod.AddGps,
        ...(!hasGeoapifyApiKey && {
          isDisabled: true,
          description:
            'Please enter Geoapify API key in Third-Party Integration to enable this feature',
        }),
      },
    ],
    [hasGeoapifyApiKey]
  );

  return (
    <Select
      className={cn(className, 'min-w-32 max-w-xs')}
      controlName="method"
      label="Type of modification"
      items={methodItems}
      isDisabled={!methodItems.length}
      selectionMode="single"
      disallowEmptySelection
      disabledKeys={methodItems
        .filter(({ isDisabled }) => !!isDisabled)
        .map(({ value }) => value)}
    >
      {(item) => {
        return (
          <SelectItem key={item.value} textValue={item.label}>
            <div>{item.label}</div>
            {!!item.description && (
              <div className="ml-4 text-sm">{item.description}</div>
            )}
          </SelectItem>
        );
      }}
    </Select>
  );
};
