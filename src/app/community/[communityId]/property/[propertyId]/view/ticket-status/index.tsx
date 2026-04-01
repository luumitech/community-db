import { Card, CardBody, CardHeader, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext } from '~/community/[communityId]/layout-context';
import { useLayoutContext as useViewLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { getFragment, graphql } from '~/graphql/generated';
import { TicketInfo } from './ticket-info';

const TicketStatusFragment = graphql(/* GraphQL */ `
  fragment PropertyId_TicketStatus on Property {
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
        ticketList {
          ticketName
          price
          count
        }
      }
    }
  }
`);

interface Props {
  className?: string;
}

export const TicketStatus: React.FC<Props> = ({ className }) => {
  const { property: propertyFragment } = useViewLayoutContext();
  const property = getFragment(TicketStatusFragment, propertyFragment);

  /**
   * TODO:
   *
   * - Most of the time, should only display tickets for current selected year
   * - And maybe for the current selected event(?)
   * - Should show amount paid, when paid, and tickets purchased.
   */
  const ticketList = property.membershipList.flatMap((membership) => {
    return membership.eventAttendedList.flatMap((event) => {
      return event.ticketList;
    });
  });

  return (
    <Card className={className}>
      <CardHeader>Ticket Status</CardHeader>
      <CardBody>
        <TicketInfo ticketList={ticketList} />
      </CardBody>
    </Card>
  );
};
