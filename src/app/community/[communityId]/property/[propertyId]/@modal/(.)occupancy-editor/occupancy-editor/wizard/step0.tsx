import React from 'react';
import { useWizard } from 'react-use-wizard';
import { StepTemplate } from './step-template';

interface Props {}

export const Step0: React.FC<Props> = (props) => {
  return <StepTemplate body={<Body {...props} />} />;
};

const Body: React.FC<Props> = (props) => {
  const { nextStep } = useWizard();

  return <div>step 0</div>;
};
