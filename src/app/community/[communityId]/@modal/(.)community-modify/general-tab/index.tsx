import { cn } from '@heroui/react';
import React from 'react';
import { DefaultSetting } from './default-setting';
import { NameEditor } from './name-editor';

interface Props {
  className?: string;
}

export const GeneralTab: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className, 'flex flex-col gap-4')}>
      <NameEditor />
      <DefaultSetting />
    </div>
  );
};
