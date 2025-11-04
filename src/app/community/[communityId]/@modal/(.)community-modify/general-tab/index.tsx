import React from 'react';
import { twMerge } from 'tailwind-merge';
import { DefaultSetting } from './default-setting';
import { NameEditor } from './name-editor';

interface Props {
  className?: string;
}

export const GeneralTab: React.FC<Props> = ({ className }) => {
  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      <NameEditor />
      <DefaultSetting />
    </div>
  );
};
