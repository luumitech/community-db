import React from 'react';
import * as GQL from '~/graphql/generated/graphql';
import { importMethodSelectionList } from '../_type';
import { usePageContext } from '../page-context';
import { useHookFormContext } from '../use-hook-form';
import { SampleXlsx } from './sample-xlsx';
import { StepTemplate } from './step-template';
import { Wizard } from './wizard';

const XlsxItem = importMethodSelectionList.find(
  (item) => item.value === GQL.ImportMethod.Xlsx
)!;

interface Props {
  className?: string;
}

export const StepMethodXlsx1: React.FC<Props> = ({ className }) => {
  const { setSelectTooltip } = usePageContext();
  const wizardContext = Wizard.useWizard();
  const formMethods = useHookFormContext();
  const { setValue } = formMethods;

  React.useEffect(() => {
    setSelectTooltip(
      <StepTemplate
        wizardContext={wizardContext}
        title="Manually import Excel file"
        body={
          <div className="flex flex-col gap-2">
            <p>
              Select <span className="text-foreground-500">Import Method</span>{' '}
              &quot;{XlsxItem.label}&quot;, to initialize database with your own
              content by uploading an Excel file.
            </p>
            <p>The excel file must have at least the following headings:</p>
            <SampleXlsx />
          </div>
        }
      />
    );
  }, [setSelectTooltip, wizardContext]);

  React.useEffect(() => {
    setValue('method', GQL.ImportMethod.Xlsx);
  }, [setValue]);

  return null;
};
