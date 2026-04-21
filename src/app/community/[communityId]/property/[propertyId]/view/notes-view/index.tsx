import { Button, Card, CardBody, CardHeader, Link, cn } from '@heroui/react';
import { ScrollShadow } from '@heroui/scroll-shadow';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { getFragment, graphql } from '~/graphql/generated';
import { appPath } from '~/lib/app-path';
import { Icon } from '~/view/base/icon';

const MembershipNotesFragment = graphql(/* GraphQL */ `
  fragment PropertyId_MembershipNotes on Property {
    id
    notes
  }
`);

interface Props {
  className?: string;
}

export const NotesView: React.FC<Props> = ({ className }) => {
  const { community, property: propertyFragment } = useLayoutContext();
  const property = getFragment(MembershipNotesFragment, propertyFragment);
  const { notes } = property;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <Button
          as={Link}
          className="ml-auto"
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
        <ScrollShadow className="h-full">
          <span className="text-sm whitespace-pre-wrap">{notes ?? ''}</span>
        </ScrollShadow>
      </CardBody>
    </Card>
  );
};
