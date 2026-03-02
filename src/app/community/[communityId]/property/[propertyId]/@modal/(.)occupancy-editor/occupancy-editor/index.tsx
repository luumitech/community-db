import { cn } from '@heroui/react';
import React from 'react';
import {
  Footer,
  Header,
  Step0,
  Step1,
  Wizard,
  type WizardContext,
} from './wizard';

interface Props {
  className?: string;
}

export const OccupancyEditor: React.FC<Props> = ({ className }) => {
  const renderHeader = React.useCallback((context: WizardContext) => {
    return <Header context={context} />;
  }, []);

  const renderFooter = React.useCallback((context: WizardContext) => {
    return <Footer context={context} />;
  }, []);

  return (
    <Wizard renderHeader={renderHeader} renderFooter={renderFooter}>
      <Wizard.Step name="editor">
        <Step0 />
      </Wizard.Step>
      <Wizard.Step name="manager">
        <Step1 />
      </Wizard.Step>
    </Wizard>
  );
};
