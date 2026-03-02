import { cn, Select, SelectItem } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import { useOccupancyEditorContext } from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/occupancy-editor-context';
import {
  useHookFormContext,
  type OccupancyInfoEntry,
} from '~/community/[communityId]/property/[propertyId]/@modal/(.)occupancy-editor/use-hook-form';
import { ItemDescription } from './item-description';
import { ItemLabel } from './item-label';

interface Props {
  className?: string;
  onSelect?: (occupancyFieldId: string) => void;
}

export const HouseholdSelect: React.FC<Props> = ({ className, onSelect }) => {
  const { occupancyInfoListMethods, occupancyFieldId } =
    useOccupancyEditorContext();
  const { fields } = occupancyInfoListMethods;
  const { subscribe, formState } = useHookFormContext();
  const [occupancyInfoList, setOccupancyInfoList] =
    React.useState<OccupancyInfoEntry[]>(fields);
  const { errors } = formState;

  React.useEffect(() => {
    const callback = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        setOccupancyInfoList(values.occupancyInfoList);
      },
    });
    return () => callback();
  }, [subscribe]);

  const errObj = R.pathOr(errors, R.stringToPath('occupancyInfoList'), {});

  const items = React.useMemo(() => {
    if (fields.length !== occupancyInfoList.length) {
      // This could happen while new entries have just been added or remove
      return [];
    }
    /**
     * Fields does not reflect the most up-to-date value after the form is
     * altered, so we added a subscription to the field values, and use the most
     * up-to-date values from it to render the selection items
     */
    return occupancyInfoList.map((entry, idx) => {
      const isCurrent = idx === 0;
      const hasError = !R.isEmpty(errObj?.[idx] ?? {});
      return {
        key: fields[idx].id,
        textLabel: idx === 0 ? 'Current Occupants' : 'Previous Occupants',
        label: (
          <ItemLabel
            occupancyInfo={entry}
            isCurrent={isCurrent}
            hasError={hasError}
          />
        ),
        description: (
          <ItemDescription occupancyInfo={entry} hasError={hasError} />
        ),
        hasError,
      };
    });
  }, [fields, occupancyInfoList, errObj]);

  return (
    <Select
      classNames={{
        base: cn('w-auto grow', className),
      }}
      label="Select households"
      items={items}
      selectedKeys={[occupancyFieldId]}
      selectionMode="single"
      disallowEmptySelection
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        onSelect?.(firstKey as string);
      }}
      renderValue={(selectItems) => {
        return selectItems.map((item) => item.data?.label);
      }}
      isInvalid={!!items.find(({ hasError }) => hasError)}
      errorMessage="Please check households for errors"
    >
      {(item) => {
        return (
          <SelectItem
            key={item.key}
            textValue={item.textLabel}
            description={item.description}
          >
            {item.label}
          </SelectItem>
        );
      }}
    </Select>
  );
};
