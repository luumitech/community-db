import React from 'react';
import { useDisclosureWithArg } from '~/custom-hooks/disclosure-with-arg';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { startDownloadBlob } from '~/lib/dom';
import { toast } from '~/view/base/toastify';
import { ModalImpl, type ModalArg } from './modal-impl';

export { type ModalArg } from './modal-impl';
export const useModalControl = useDisclosureWithArg<ModalArg>;
export type ModalControl = ReturnType<typeof useModalControl>;

interface Props {
  modalControl: ModalControl;
}

export const ExportModal: React.FC<Props> = ({ modalControl }) => {
  const { arg, disclosure } = modalControl;

  const onSave = React.useCallback(
    async (csv: string) => {
      if (arg) {
        const blob = new Blob([csv], { type: 'text/csv' });
        startDownloadBlob(blob, arg.exportFn);
      }
    },
    [arg]
  );

  if (arg == null) {
    return null;
  }

  return <ModalImpl {...arg} disclosure={disclosure} onSave={onSave} />;
};
