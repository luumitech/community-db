import React from 'react';
import { Textarea } from '~/view/base/textarea';

interface Props {
  className?: string;
}

export const NotesEditor: React.FC<Props> = ({ className }) => {
  return (
    <Textarea
      className={className}
      controlName="notes"
      variant="bordered"
      label="Notes"
      placeholder="Enter notes"
    />
  );
};
