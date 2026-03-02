import React from 'react';
import { appLabel } from '~/lib/app-path';
import { type WizardContext } from '..';
import { MailchimpNotice } from './mailchimp-notice';

interface Props {
  context: WizardContext;
}

export const Step0Header: React.FC<Props> = ({ context }) => {
  return (
    <div className="flex flex-col">
      {appLabel('occupancyEditor')}
      <MailchimpNotice />
    </div>
  );
};
