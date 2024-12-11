import { Select, SelectItem, SelectSection } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';

interface Props {
  className?: string;
}

export const EventNameSelect: React.FC<Props> = ({ className }) => {
  const { selectEventSections, communityUi } = useAppContext();
  const { lastEventSelected } = communityUi;

  return (
    <Select
      className={clsx(className)}
      label="Current Event Name"
      items={selectEventSections}
      placeholder="Select an event"
      color="primary"
      selectedKeys={lastEventSelected ? [lastEventSelected] : []}
      onSelectionChange={(keys) => {
        const [firstKey] = keys;
        communityUi.actions.setLastEventSelected(
          firstKey?.toString() ?? undefined
        );
      }}
    >
      {(section) => (
        <SelectSection
          key={section.title}
          title={section.title}
          items={section.items}
          showDivider={section.showDivider}
        >
          {(item) => (
            <SelectItem key={item.value} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </SelectSection>
      )}
    </Select>
  );
};
