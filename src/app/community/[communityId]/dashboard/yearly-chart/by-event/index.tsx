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
import { ParticipationChart } from './participation-chart';
import { TicketSaleTable } from './ticket-sale-table';

const EventTicketFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventTicket on Community {
    communityStat {
      memberSourceStat(year: $year) {
        eventName
        new
        renew
        existing
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

export const ByEvent: React.FC<Props> = ({
  className,
  fragment,
  year,
  isLoading,
}) => {
  const { eventSelected } = useYearlyContext();
  const entry = getFragment(EventTicketFragment, fragment);
  const ticketStat = entry?.communityStat.ticketStat ?? [];
  const memberSourceStat = entry?.communityStat.memberSourceStat ?? [];
  const ticketList = ticketStat.filter(
    ({ eventName }) => eventName === eventSelected
  );
  const eventList = memberSourceStat.map(({ eventName }) => eventName);
  const yearMemberSourceStat = memberSourceStat.filter(
    ({ eventName }) => eventName === eventSelected
  );

  const EventSelect = React.useCallback(() => {
    if (!eventList.length) {
      return null;
    }
    return <EventNameSelect eventList={eventList} />;
  }, [eventList]);

  const EventDetails = React.useCallback(() => {
    if (!eventList.length || !eventSelected) {
      return null;
    }
    return (
      <>
        <Spacer y={4} />
        <ParticipationChart
          year={year}
          memberSourceStat={yearMemberSourceStat}
        />
        <Spacer y={4} />
        <TicketSaleTable ticketList={ticketList} />
      </>
    );
  }, [eventList.length, eventSelected, year, yearMemberSourceStat, ticketList]);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex flex-col">
          <p className="font-bold text-md">{`${year} Event Details`}</p>
        </div>
      </CardHeader>
      <CardBody>
        <Skeleton
          className="flex flex-col rounded-lg min-h-[400px]"
          aria-label="skeleton"
          isLoaded={!isLoading}
        >
          <EventSelect />
          <EventDetails />
        </Skeleton>
      </CardBody>
    </Card>
  );
};
