import { Card, CardBody, CardHeader, Link, cn } from '@heroui/react';
import { ScrollShadow } from '@heroui/scroll-shadow';
import React from 'react';
import { appLabel, appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';
import { useLayoutContext } from '../layout-context';
import { ModalButton } from '../modal-button';

interface Props {
  className?: string;
  notes?: string | null;
}

export const NotesView: React.FC<Props> = ({ className, notes }) => {
  const { community, property } = useLayoutContext();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        Notes
        <ModalButton
          as={Link}
          className="absolute top-2 right-2"
          color="primary"
          variant="bordered"
          href={appPath('membershipEditor', {
            path: { communityId: community.id, propertyId: property.id },
            query: { autoFocus: 'notes-helper' },
          })}
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
