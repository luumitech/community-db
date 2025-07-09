import React from 'react';
import { useWizard } from 'react-use-wizard';
import * as R from 'remeda';
import { FilterSelect } from '../filter-select';
import { useHookFormContext } from '../use-hook-form';
import { FooterDefault } from './footer-default';
import { StepTemplate } from './step-template';

interface Props {}

export const Step1: React.FC<Props> = ({}) => {
  const { formState, watch } = useHookFormContext();
  const memberYear = watch('filter.memberYear');

  const nextDisabled = React.useMemo(() => {
    return R.isEmpty(memberYear?.toString());
  }, [memberYear]);

  return (
    <StepTemplate
      body={<Body />}
      footer={<FooterDefault nextDisabled={nextDisabled} />}
    />
  );
};

const Body: React.FC<Props> = ({}) => {
  const { previousStep } = useWizard();

  return <FilterSelect className="mb-4" yearRequired />;
};
