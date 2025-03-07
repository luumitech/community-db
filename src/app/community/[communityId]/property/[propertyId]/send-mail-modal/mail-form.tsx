import { cn } from '@heroui/react';
import React from 'react';
import { Input } from '~/view/base/input';
import { MessageEditor } from './message-editor';
import { ToSelect } from './to-select';

interface Props {
  className?: string;
}

export const MailForm: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-2')}>
      <ToSelect />
      <Input
        controlName="subject"
        label="Subject"
        variant="bordered"
        description="heh"
      />
      <MessageEditor />
    </div>
  );
};
