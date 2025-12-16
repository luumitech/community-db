import React from 'react';
import { useWizard } from 'react-use-wizard';
import * as R from 'remeda';
import * as GQL from '~/graphql/generated/graphql';
import { FilterSelect } from '../filter-select';
import { useHookFormContext } from '../use-hook-form';
import { FooterDefault } from './footer-default';
import { StepTemplate } from './step-template';

interface Props {}

export const Step1: React.FC<Props> = (props) => {
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
        return <AddEventBody {...props} />;

      case GQL.BatchModifyMethod.AddGps:
        return <AddGpsBody {...props} />;

      default:
        throw new Error('Unsupported method');
    }
  }, [method, props]);

  return (
    <StepTemplate
      body={body}
      footer={<FooterDefault nextDisabled={nextDisabled} />}
    />
  );
};

const AddEventBody: React.FC<Props> = ({}) => {
  const { previousStep } = useWizard();

  return <FilterSelect className="mb-4" yearRequired />;
};

const AddGpsBody: React.FC<Props> = ({}) => {
  const { previousStep } = useWizard();

  return <FilterSelect className="mb-4" withGps />;
};
