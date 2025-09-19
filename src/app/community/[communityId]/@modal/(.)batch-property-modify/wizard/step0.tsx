import React from 'react';
import { useWizard } from 'react-use-wizard';
import { MethodSelect } from '../method-select';
import { useCheckMethodRequirement } from '../method-select/check-method-requirement';
import { FooterDefault } from './footer-default';
import { StepTemplate } from './step-template';

interface Props {}

export const Step0: React.FC<Props> = (props) => {
  const msg = useCheckMethodRequirement();

  return (
    <StepTemplate
      body={<Body {...props} />}
      footer={<FooterDefault nextDisabled={!!msg} />}
    />
  );
};

const Body: React.FC<Props> = (props) => {
  const { nextStep } = useWizard();

  return <MethodSelect {...props} />;
};
