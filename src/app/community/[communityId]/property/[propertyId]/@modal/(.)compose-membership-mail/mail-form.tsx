import React from 'react';
import { twMerge } from 'tailwind-merge';
import { InputEmail } from '~/view/base/input-email';
import { mentionClass } from './editor-util';
import { TextEditor } from './text-editor';
import { ToSelect } from './to-select';

interface Props {
  className?: string;
}

export const MailForm: React.FC<Props> = ({ className }) => {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <ToSelect />
      <InputEmail controlName="defaultSetting.membershipEmail.cc" label="Cc" />
      <TextEditor
        controlName="defaultSetting.membershipEmail.subject"
        label="Subject"
        maxRows={1}
      />
      <TextEditor
        controlName="defaultSetting.membershipEmail.message"
        label="Message"
        description={
          <div>
            Type{' '}
            <span className={mentionClass.container}>
              <span className={mentionClass.value}>@</span>
            </span>{' '}
            to insert template values
          </div>
        }
      />
    </div>
  );
};
