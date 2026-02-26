import React from 'react';
import { ModalBody } from '~/view/base/modal';

interface Props {
  body: React.ReactNode;
}

export const StepTemplate: React.FC<Props> = ({ body }) => {
  return (
    <>
      <ModalBody>{body}</ModalBody>
    </>
  );
};
