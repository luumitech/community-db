import React from 'react';
import { useWizard } from 'react-use-wizard';
import { MethodSelect } from '../method-select';
import { FooterDefault } from './footer-default';
import { StepTemplate } from './step-template';

interface Props {}

export const Step0: React.FC<Props> = ({}) => {
  return <StepTemplate body={<Body />} footer={<FooterDefault />} />;
};

const Body: React.FC<Props> = ({}) => {
  const { nextStep } = useWizard();

  return <MethodSelect />;
};
