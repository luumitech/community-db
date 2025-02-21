import React from 'react';
import { useWizard } from 'react-use-wizard';
import * as GQL from '~/graphql/generated/graphql';
import { importMethodSelectionList } from '../_type';
import { usePageContext } from '../page-context';
import { SampleXlsx } from './sample-xlsx';
import { StepTemplate } from './step-template';

const XlsxItem = importMethodSelectionList.find(
  (item) => item.value === GQL.ImportMethod.Xlsx
)!;

interface Props {
  className?: string;
}

export const Step2: React.FC<Props> = ({ className }) => {
  const { setSelectTooltip } = usePageContext();
  const wizardValues = useWizard();

  React.useEffect(() => {
    setSelectTooltip(
      <StepTemplate
        wizardValues={wizardValues}
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
  }, [setSelectTooltip, wizardValues]);

  return null;
};
