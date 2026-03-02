import { Button, cn } from '@heroui/react';
import React from 'react';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { ModalBody } from '~/view/base/modal';
import { FilterSelect } from '../filter-select';
import { useHookFormContext } from '../use-hook-form';

export interface Step1Props {}

export const Step1: React.FC<Step1Props> = (props) => {
  const { watch } = useHookFormContext();
  const method = watch('method');
  const memberYearList = watch('filter.memberYearList');

  const nextDisabled = React.useMemo(() => {
    switch (method) {
      case GQL.BatchModifyMethod.AddEvent:
        return R.isEmpty(memberYearList?.toString());

      case GQL.BatchModifyMethod.AddGps:
        return false;

      default:
        throw new Error('Unsupported method');
    }
  }, [memberYearList, method]);

  const body = React.useMemo(() => {
    switch (method) {
      case GQL.BatchModifyMethod.AddEvent:
        return <FilterSelect className="mb-4" yearRequired />;

      case GQL.BatchModifyMethod.AddGps:
        return <FilterSelect className="mb-4" withGps />;

      default:
        throw new Error('Unsupported method');
    }
  }, [method]);

  return <ModalBody>{body}</ModalBody>;
};
