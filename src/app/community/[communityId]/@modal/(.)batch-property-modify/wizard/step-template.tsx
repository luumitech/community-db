import React from 'react';
import { ModalBody, ModalFooter } from '~/view/base/modal';

interface Props {
  body: React.ReactNode;
  footer: React.ReactNode;
}

export const StepTemplate: React.FC<Props> = ({ body, footer }) => {
  return (
    <>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </>
  );
};
