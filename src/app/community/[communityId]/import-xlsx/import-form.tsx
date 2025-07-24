import { Tooltip, cn } from '@heroui/react';
import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import * as GQL from '~/graphql/generated/graphql';
import { Select, SelectItem } from '~/view/base/select';
import { importMethodSelectionList } from './_type';
import { MethodMap } from './method-map';
import { useCheckMethodRequirement } from './method-map/check-method-requirement';
import { MethodRandom } from './method-random';
import { MethodXlsx } from './method-xlsx';
import { usePageContext } from './page-context';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const ImportForm: React.FC<Props> = ({ className }) => {
  const isSmallDevice = useMediaQuery('(max-width: 800px)');
  const formMethods = useHookFormContext();
  const { watch } = formMethods;
  const importMethod = watch('method');
  const { selectTooltip } = usePageContext();
  const msg = useCheckMethodRequirement();

  return (
    <div className={cn(className, 'flex flex-col h-full gap-2')}>
      <Tooltip
        classNames={{
          base: cn({
            'max-w-[calc(100vw-2rem)]': isSmallDevice,
            'max-w-[calc(100vw-26rem)]': !isSmallDevice,
          }),
          content: 'p-0',
        }}
        showArrow
        placement={isSmallDevice ? 'bottom' : 'right-start'}
        isOpen={!!selectTooltip}
        onOpenChange={(open) => {}}
        content={selectTooltip}
      >
        <div className="max-w-sm">
          <Select
            controlName="method"
            label="Import Method"
            items={importMethodSelectionList}
            placeholder="Select an import method"
            disallowEmptySelection
          >
            {(item) => (
              <SelectItem key={item.value} textValue={item.label}>
                {item.label}
              </SelectItem>
            )}
          </Select>
        </div>
      </Tooltip>
      {msg}
      {importMethod === GQL.ImportMethod.Xlsx && <MethodXlsx />}
      {importMethod === GQL.ImportMethod.Map && <MethodMap />}
      {importMethod === GQL.ImportMethod.Random && <MethodRandom />}
    </div>
  );
};
