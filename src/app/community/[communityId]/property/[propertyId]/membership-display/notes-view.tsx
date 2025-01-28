import { Card, CardBody, CardHeader } from '@heroui/react';
import { ScrollShadow } from '@heroui/scroll-shadow';
import clsx from 'clsx';
import React from 'react';

interface Props {
  className?: string;
  notes?: string | null;
}

export const NotesView: React.FC<Props> = ({ className, notes }) => {
  return (
    <Card className={clsx(className)}>
      <CardHeader>Notes</CardHeader>
      <CardBody>
        <ScrollShadow className="h-28">
          <span className="whitespace-pre-wrap text-sm">{notes ?? ''}</span>
        </ScrollShadow>
      </CardBody>
    </Card>
  );
};
