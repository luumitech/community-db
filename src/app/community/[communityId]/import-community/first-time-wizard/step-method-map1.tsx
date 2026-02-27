import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { appTitle } from '~/lib/env';
import { importMethodSelectionList } from '../_type';
import { usePageContext } from '../page-context';
import { useHookFormContext } from '../use-hook-form';
import { StepTemplate } from './step-template';
import { Wizard } from './wizard';

const MapItem = importMethodSelectionList.find(
  (item) => item.value === GQL.ImportMethod.Map
)!;

interface Props {
  className?: string;
}

export const StepMethodMap1: React.FC<Props> = ({ className }) => {
  const { setSelectTooltip } = usePageContext();
  const wizardContext = Wizard.useWizard();
  const formMethods = useHookFormContext();
  const { setValue } = formMethods;

  React.useEffect(() => {
    setSelectTooltip(
      <StepTemplate
        wizardContext={wizardContext}
        title="Add addresses by drawing a map boundary"
        body={
          <div className="flex flex-col gap-2">
            <p>
              Select <span className="text-foreground-500">Import Method</span>{' '}
              &quot;{MapItem.label}&quot;, to import property entries by drawing
              a map boundary.
            </p>
            <p>
              Try this if each property in the community has a unique address
              visible on the map, you can draw one or more boundaries directly
              on the map. {appTitle} will then automatically identify the
              addresses within those boundaries and create property entries for
              you.
            </p>
          </div>
        }
      />
    );
  }, [setSelectTooltip, wizardContext]);

  React.useEffect(() => {
    setValue('method', GQL.ImportMethod.Map);
  }, [setValue]);

  return null;
};
