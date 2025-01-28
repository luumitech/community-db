import { Card, CardBody, CardHeader, Skeleton, Spacer } from '@heroui/react';
import clsx from 'clsx';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type DashboardEntry } from '../_type';
import { useYearlyContext } from '../yearly-context';
import { EventNameSelect } from './event-name-select';
import { TicketSaleTable } from './ticket-sale-table';

const EventTicketFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventTicket on Community {
    communityStat {
      eventStat(year: $year) {
        eventName
        ticketList {
          ticketName
          count
          price
          paymentMethod
        }
      }
    }
  }
`);

interface Props {
  className?: string;
  fragment?: DashboardEntry;
  year: number;
  isLoading?: boolean;
}

export const EventTicketSale: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
  const { eventSelected } = useYearlyContext();
  const entry = getFragment(EventTicketFragment, fragment);
  const eventStat = entry?.communityStat.eventStat ?? [];
  const ticketList =
    eventStat.find(({ eventName }) => eventName === eventSelected)
      ?.ticketList ?? [];

  return (
    <Card className={clsx(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Event Ticket Sale`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg" isLoaded={!isLoading}>
          <EventNameSelect />
          <Spacer y={2} />
          <TicketSaleTable ticketList={ticketList} />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
