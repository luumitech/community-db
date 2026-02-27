import React from 'react';
import { type WizardContext } from '..';
import { useCheckMethodRequirement } from '../../method-select/check-method-requirement';
import { FooterDefault } from './footer-default';

interface Props {
  context: WizardContext;
}

export const Step0Footer: React.FC<Props> = ({ context }) => {
  const msg = useCheckMethodRequirement();

  return <FooterDefault context={context} nextDisabled={!!msg} />;
};
