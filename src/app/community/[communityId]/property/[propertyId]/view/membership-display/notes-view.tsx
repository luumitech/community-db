import { Button, Card, CardBody, CardHeader, Link, cn } from '@heroui/react';
import { ScrollShadow } from '@heroui/scroll-shadow';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

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
        <Button
          as={Link}
          className="absolute top-2 right-2"
          color="primary"
          variant="bordered"
          size="sm"
          endContent={<Icon icon="edit" />}
          href={appPath('membershipEditor', {
            path: { communityId: community.id, propertyId: property.id },
            query: { autoFocus: 'notes-helper' },
          })}
        >
          Edit Notes
        </Button>
      </CardHeader>
      <CardBody>
        <ScrollShadow className="h-28">
          <span className="whitespace-pre-wrap text-sm">{notes ?? ''}</span>
        </ScrollShadow>
      </CardBody>
    </Card>
  );
};
