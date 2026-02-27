import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { appTitle } from '~/lib/env';
import { importMethodSelectionList } from '../_type';
import { usePageContext } from '../page-context';
import { useHookFormContext } from '../use-hook-form';
import { StepTemplate } from './step-template';
import { Wizard } from './wizard';

const RandomItem = importMethodSelectionList.find(
  (item) => item.value === GQL.ImportMethod.Random
)!;

interface Props {
  className?: string;
}

export const StepMethodRandom1: React.FC<Props> = ({ className }) => {
  const { setSelectTooltip } = usePageContext();
  const wizardContext = Wizard.useWizard();
  const formMethods = useHookFormContext();
  const { setValue } = formMethods;

  React.useEffect(() => {
    setSelectTooltip(
      <StepTemplate
        wizardContext={wizardContext}
        title="Quick start guide"
        body={
          <div className="flex flex-col gap-2">
            <p>
              Select <span className="text-foreground-500">Import Method</span>{' '}
              &quot;{RandomItem.label}&quot;, to create a few random entries
              into the database.
            </p>
            <p>
              Try this if you are using {appTitle} for the first time, so you
              can try various functions without manually creating your own
              database content.
            </p>
          </div>
        }
      />
    );
  }, [setSelectTooltip, wizardContext]);

  React.useEffect(() => {
    setValue('method', GQL.ImportMethod.Random);
  }, [setValue]);

  return null;
};
