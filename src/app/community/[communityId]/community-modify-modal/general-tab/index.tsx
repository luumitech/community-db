import clsx from 'clsx';
import React from 'react';
import { DefaultSetting } from './default-setting';
import { NameEditor } from './name-editor';

interface Props {
  className?: string;
}

export const GeneralTab: React.FC<Props> = ({ className }) => {
  return (
    <div className={clsx(className, 'flex flex-col gap-4')}>
      <NameEditor />
      <DefaultSetting />
    </div>
  );
};
