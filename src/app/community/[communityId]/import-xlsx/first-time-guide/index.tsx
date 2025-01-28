import { Card, CardBody, CardHeader } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { appTitle } from '~/lib/env-var';
import { SampleXlsx } from './sample-xlsx';

interface Props {
  className?: string;
}

export const FirstTimeGuide: React.FC<Props> = ({ className }) => {
  return (
    <Card className={clsx(className)}>
      <CardHeader className="font-semibold text-lg">
        Import guide for first time user
      </CardHeader>
      <CardBody className="gap-4">
        <p>
          To get started quickly, you can select the &quot;Randomly generate
          sample data&quot; from Import Method above. This is a good way to
          explore {appTitle} and its various functions.
        </p>
        <p>
          To import an Excel document, the document should contain at least the
          following headings:
        </p>
        <ul className="list-disc pl-6">
          <li className="font-semibold">Address</li>
          <li className="font-semibold">StreetNo</li>
          <li className="font-semibold">StreetName</li>
          <li className="font-semibold">PostalCode</li>
        </ul>
        <p>For example:</p>
        <SampleXlsx />
        <p>
          If you want to add contact information for each household, you can use
          the following headings:
        </p>
        <ul className="list-disc pl-6">
          <li className="font-semibold">FirstName1, FirstName2, ...</li>
          <li className="font-semibold">LastName1, LastName2, ...</li>
          <li className="font-semibold">EMail1, Email2, ...</li>
          <li className="font-semibold">CellPhone1, CellPohone2, ...</li>
        </ul>
        <p>
          Once you have imported your data, you can use {appTitle} to add or
          modify any information within the community.
        </p>
      </CardBody>
    </Card>
  );
};
