import React from 'react';
import { AddressEditorForm } from '~/community/[communityId]/common/address-editor-form';
import { useHookFormContext } from './use-hook-form';

interface Props {
  className?: string;
}

export const AddressEditor: React.FC<Props> = ({ className }) => {
  const formContext = useHookFormContext();

  // @ts-expect-error check InputData is compatible with form
  return <AddressEditorForm className={className} {...formContext} />;
};
