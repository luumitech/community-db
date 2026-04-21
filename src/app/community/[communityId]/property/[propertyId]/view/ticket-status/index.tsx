import { Card, CardBody, cn } from '@heroui/react';
import React from 'react';
import { useLayoutContext as useViewLayoutContext } from '~/community/[communityId]/property/[propertyId]/layout-context';
import { useSelector } from '~/custom-hooks/redux';
import { getFragment, graphql } from '~/graphql/generated';
import { sortDate } from '~/lib/date-util';
import { TicketSelect } from './ticket-select';
import { TicketTable } from './ticket-table';
import { makeTicketRow, ticketInfoForYear } from './ticket-util';

const TicketStatusFragment = graphql(/* GraphQL */ `
  fragment PropertyId_TicketStatus on Property {
    membershipList {
      year
      isMember
      eventAttendedList {
        eventName
        eventDate
        ticketList {
          ticketName
          paymentDate
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
  const { yearSelected, ticketSelected } = useSelector((state) => state.ui);

  const allTicketList = React.useMemo(
    () => ticketInfoForYear(property),
    [property]
  );

  const ticketList = React.useMemo(() => {
    return allTicketList
      .filter(
        ({ membership, ticket }) =>
          membership.year === yearSelected &&
          ticket.ticketName === ticketSelected
      )
      .sort((a, b) => sortDate('desc')(a.event.eventDate, b.event.eventDate))
      .map((ticket) => makeTicketRow(ticket));
  }, [allTicketList, yearSelected, ticketSelected]);

  const topContent = React.useMemo(() => {
    return <TicketSelect className="mb-2" />;
  }, []);

  return (
    <Card className={className}>
      <CardBody>
        <TicketTable topContent={topContent} items={ticketList} />
      </CardBody>
    </Card>
  );
};
