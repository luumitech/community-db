import { cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { Card } from '~/view/base/card';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { EventNameSelect } from './event-name-select';
import { ParticipationChart } from './participation-chart';
import { TotalSales } from './total-sales';

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
        paymentMethod
        count
        price
      }
      membershipFeeStat(year: $year) {
        key
        eventName
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

  const byEventStat = entry?.communityStat.byEventStat ?? [];
  const eventList = byEventStat.map(({ eventName }) => eventName);
  const yearByEventStat = byEventStat.find(
    ({ eventName }) => eventName === eventSelected
  );

  const revenueStat = React.useMemo(() => {
    return [
      ...(entry?.communityStat.ticketStat ?? [])
        .filter(({ eventName }) => eventName === eventSelected)
        .map(({ ticketName, ...rest }) => ({
          ...rest,
          itemName: ticketName,
        })),
      ...(entry?.communityStat.membershipFeeStat ?? [])
        .filter(({ eventName }) => eventName === eventSelected)
        .map((feeEntry) => ({
          ...feeEntry,
          itemName: 'Membership Fee',
        })),
    ];
  }, [entry?.communityStat, eventSelected]);

  return (
    <Card className={cn(className, 'h-full')}>
      <Card.Body className="flex flex-col gap-2">
        <EventNameSelect eventList={eventList} />
        {year != null && (
          <ParticipationChart
            year={year}
            byEventStat={yearByEventStat ?? null}
          />
        )}
        <TotalSales revenueStat={revenueStat} isLoading={isLoading} />
      </Card.Body>
    </Card>
  );
};

export const ByEvent = {
  Title,
  Chart,
};
