import { cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { Card } from '~/view/base/card';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { EventNameSelect } from './event-name-select';
import { ParticipationChart } from './participation-chart';
import { TicketSaleTable } from './ticket-sale-table';

const EventTicketFragment = graphql(/* GraphQL */ `
  fragment Dashboard_EventTicket on Community {
    communityStat {
      byEventStat(year: $year) {
        eventName
        new
        renew
        existing
        nonMember
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

const Title: React.FC = () => {
  const { year } = usePageContext();
  return (
    <WidgetTitle>{`${year} ${allowableWidgets.byEvent.info.label}`}</WidgetTitle>
  );
};

interface Props {
  className?: string;
}

const Chart: React.FC<Props> = ({ className }) => {
  const { eventSelected, community, year, isLoading } = usePageContext();
  const entry = getFragment(EventTicketFragment, community);
  const ticketStat = entry?.communityStat.ticketStat ?? [];
  const byEventStat = entry?.communityStat.byEventStat ?? [];
  const ticketList = ticketStat.filter(
    ({ eventName }) => eventName === eventSelected
  );
  const eventList = byEventStat.map(({ eventName }) => eventName);
  const yearByEventStat = byEventStat.find(
    ({ eventName }) => eventName === eventSelected
  );

  const EventDetails = React.useCallback(() => {
    if (!eventList.length || !eventSelected || !year) {
      return null;
    }
    return (
      <>
        <ParticipationChart year={year} byEventStat={yearByEventStat ?? null} />
        <TicketSaleTable ticketList={ticketList} />
      </>
    );
  }, [eventList.length, eventSelected, year, yearByEventStat, ticketList]);

  return (
    <Card className={cn(className, 'h-full')}>
      <Card.Body className="flex flex-col gap-2">
        <EventNameSelect eventList={eventList} />
        <EventDetails />
      </Card.Body>
    </Card>
  );
};

export const ByEvent = {
  Title,
  Chart,
};
