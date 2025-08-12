import React from 'react';
import { useWizard } from 'react-use-wizard';
import { usePageContext } from '../page-context';
import { StepTemplate } from './step-template';

interface Props {
  className?: string;
}

export const StepMethodXlsx2: React.FC<Props> = ({ className }) => {
  const { setSelectTooltip } = usePageContext();
  const wizardValues = useWizard();

  React.useEffect(() => {
    setSelectTooltip(
      <StepTemplate
        wizardValues={wizardValues}
        title="More about Excel file format"
        body={
          <div className="flex flex-col gap-2">
            <p>
              If you want to add contact information for each household, you can
              use the following headings:
            </p>
            <ul className="list-disc pl-6">
              <li className="font-semibold">FirstName1, FirstName2, ...</li>
              <li className="font-semibold">LastName1, LastName2, ...</li>
              <li className="font-semibold">EMail1, Email2, ...</li>
              <li className="font-semibold">CellPhone1, CellPohone2, ...</li>
            </ul>
            <p>
              We support a lot more headings, you can find out what they are by
              exporting the database after you have made changes to the
              database.
            </p>
          </div>
        }
      />
    );
  }, [setSelectTooltip, wizardValues]);

  return null;
};
