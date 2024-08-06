import { Card, CardBody, CardHeader } from '@nextui-org/react';
import clsx from 'clsx';
import React from 'react';
import { useAppContext } from '~/custom-hooks/app-context';
import { useFieldArray } from '~/custom-hooks/hook-form';
import { EventsAttendedSelect } from './events-attended-select';
import { PaymentInfoEditor } from './payment-info-editor';
import { useHookFormContext } from './use-hook-form';
import { YearSelect } from './year-select';

interface Props {
  className?: string;
}

export const MembershipInfoEditor: React.FC<Props> = ({ className }) => {
  const { communityUi } = useAppContext();
  const [selectedYear, setSelectedYear] = React.useState(
    communityUi.yearSelected
  );
  const { control } = useHookFormContext();
  const membershipMethods = useFieldArray({
    control,
    name: 'membershipList',
  });
  const { fields } = membershipMethods;

  const idx = React.useMemo(() => {
    const foundIdx = fields.findIndex(
      (entry) => entry.year.toString() === selectedYear
    );
    return foundIdx;
  }, [selectedYear, fields]);

  return (
    <div className={clsx(className)}>
      <Card>
        <CardHeader>
          <YearSelect
            membershipMethods={membershipMethods}
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </CardHeader>
        {idx > -1 && (
          <CardBody key={selectedYear}>
            <PaymentInfoEditor className="pb-4" yearIdx={idx} />
            <EventsAttendedSelect yearIdx={idx} />
          </CardBody>
        )}
      </Card>
    </div>
  );
};
