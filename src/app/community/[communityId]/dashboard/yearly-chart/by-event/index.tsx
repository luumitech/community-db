import { Card, CardBody, Skeleton, Spacer, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
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
  const memberSourceStat = entry?.communityStat.memberSourceStat ?? [];
  const ticketList = ticketStat.filter(
    ({ eventName }) => eventName === eventSelected
  );
  const eventList = memberSourceStat.map(({ eventName }) => eventName);
  const yearMemberSourceStat = memberSourceStat.find(
    ({ eventName }) => eventName === eventSelected
  );

  const EventSelect = React.useCallback(() => {
    if (!eventList.length) {
      return null;
    }
    return <EventNameSelect eventList={eventList} />;
  }, [eventList]);

  const EventDetails = React.useCallback(() => {
    if (!eventList.length || !eventSelected || !year) {
      return null;
    }
    return (
      <>
        <Spacer y={4} />
        <ParticipationChart
          year={year}
          memberSourceStat={yearMemberSourceStat ?? null}
        />
        <Spacer y={4} />
        <TicketSaleTable ticketList={ticketList} />
      </>
    );
  }, [eventList.length, eventSelected, year, yearMemberSourceStat, ticketList]);

  return (
    <Card className={cn(className)}>
      <CardBody>
        <Skeleton
          className="flex h-full flex-col rounded-lg"
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

export const ByEvent = {
  Title,
  Chart,
};
