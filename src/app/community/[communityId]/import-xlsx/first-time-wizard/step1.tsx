import React from 'react';
import { useWizard } from 'react-use-wizard';
import * as GQL from '~/graphql/generated/graphql';
import { appTitle } from '~/lib/env-var';
import { importMethodSelectionList } from '../_type';
import { usePageContext } from '../page-context';
import { StepTemplate } from './step-template';

const RandomItem = importMethodSelectionList.find(
  (item) => item.value === GQL.ImportMethod.Random
)!;

interface Props {
  className?: string;
}

export const Step1: React.FC<Props> = ({ className }) => {
  const { setSelectTooltip } = usePageContext();
  const wizardValues = useWizard();

  React.useEffect(() => {
    setSelectTooltip(
      <StepTemplate
        wizardValues={wizardValues}
        title="Quick start guide"
        body={
          <div className="flex flex-col gap-2">
            <p>
              Try <span className="text-foreground-500">Import Method</span>{' '}
              &quot;{RandomItem.label}&quot;, to create a few random entries
              into the database.
            </p>
            <p>
              This will allow you to explore {appTitle} and its various
              functions without manually creating your own database content.
            </p>
          </div>
        }
      />
    );
  }, [setSelectTooltip, wizardValues]);

  return null;
};
