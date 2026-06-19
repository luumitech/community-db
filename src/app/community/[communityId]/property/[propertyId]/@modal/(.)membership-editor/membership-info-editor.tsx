import { Spacer, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { useSelector } from '~/custom-hooks/redux';
import * as GQL from '~/graphql/generated/types';
import { EventInfoEditor } from './event-info-editor';
import { MembershipEditor } from './membership-editor';
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
  const { minYear, maxYear } = useLayoutContext();
  const { yearSelected } = useSelector((state) => state.ui);
  const [selectedYear, setSelectedYear] = React.useState(
    yearSelected?.toString()
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
    <div className={cn('flex flex-col gap-4', className)}>
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
      {idx > -1 && (
        <React.Fragment key={fields[idx].id}>
          <MembershipEditor membershipPrefix={`membershipList.${idx}`} />
          <EventInfoEditor membershipPrefix={`membershipList.${idx}`} />
        </React.Fragment>
      )}
    </div>
  );
};
