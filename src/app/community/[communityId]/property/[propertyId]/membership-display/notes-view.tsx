import { Button, Card, CardBody, CardHeader, cn } from '@heroui/react';
import { ScrollShadow } from '@heroui/scroll-shadow';
import React from 'react';
import { Icon } from '~/view/base/icon';
import { ModalButton } from '../modal-button';
import { usePageContext } from '../page-context';

interface Props {
  className?: string;
  notes?: string | null;
}

export const NotesView: React.FC<Props> = ({ className, notes }) => {
  const { membershipEditor } = usePageContext();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        Notes
        <ModalButton
          className="absolute top-2 right-2"
          color="primary"
          variant="bordered"
          onPress={() => membershipEditor.open({ autoFocus: 'notes-helper' })}
        >
          Edit Notes
        </ModalButton>
      </CardHeader>
      <CardBody>
        <ScrollShadow className="h-28">
          <span className="whitespace-pre-wrap text-sm">{notes ?? ''}</span>
        </ScrollShadow>
      </CardBody>
    </Card>
  );
};
