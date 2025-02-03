import { Spacer, cn } from '@heroui/react';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFieldArray } from '~/custom-hooks/hook-form';
import * as GQL from '~/graphql/generated/graphql';
import { EventInfoEditor } from './event-info-editor';
import { useHookFormContext } from './use-hook-form';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
  property: GQL.PropertyId_MembershipEditorFragment;
}

export const MembershipInfoEditor: React.FC<Props> = ({
  className,
  property,
}) => {
  const { communityUi, minYear, maxYear } = useAppContext();
  const [selectedYear, setSelectedYear] = React.useState(
    communityUi.yearSelected
  );
  const { control } = useHookFormContext();
  const membershipMethods = useFieldArray({
    control,
    name: 'membershipList',
  });
  const { fields, prepend } = membershipMethods;
  const idx = React.useMemo(() => {
    const foundIdx = fields.findIndex(
      (entry) => entry.year.toString() === selectedYear
    );
    return foundIdx;
  }, [selectedYear, fields]);

  return (
    <div className={cn(className)}>
      <YearSelect
        yearRange={[minYear, Math.max(fields[0].year, maxYear)]}
        membershipList={property.membershipList}
        selectedYear={selectedYear}
        onChange={setSelectedYear}
        onAddYear={(item) => {
          prepend(item);
          setSelectedYear(item.year.toString());
        }}
      />
      <Spacer y={4} />
      {idx > -1 && <EventInfoEditor key={fields[idx].id} yearIdx={idx} />}
    </div>
  );
};
