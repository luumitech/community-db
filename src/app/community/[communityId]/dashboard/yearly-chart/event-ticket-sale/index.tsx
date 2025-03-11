import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  Spacer,
  cn,
} from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { type DashboardEntry } from '../_type';
import { useYearlyContext } from '../yearly-context';
import { EventNameSelect } from './event-name-select';
import { TicketSaleTable } from './ticket-sale-table';

const EventTicketFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventTicket on Community {
    communityStat {
      memberSourceStat(year: $year) {
        eventName
      }
      ticketStat(year: $year) {
        key
        ticketName
        eventName
        membershipYear
        paymentMethod
        count
        price
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
  const ticketStat = entry?.communityStat.ticketStat ?? [];
  const ticketList = ticketStat.filter(
    ({ eventName }) => eventName === eventSelected
  );
  const eventList = (entry?.communityStat.memberSourceStat ?? []).map(
    ({ eventName }) => eventName
  );

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Event Ticket Sale`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton className="rounded-lg min-h-[400px]" isLoaded={!isLoading}>
          <EventNameSelect eventList={eventList} />
          {!!eventSelected && (
            <>
              <Spacer y={2} />
              <TicketSaleTable ticketList={ticketList} />
            </>
          )}
        </Skeleton>
      </CardBody>
    </Card>
  );
};
