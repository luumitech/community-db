import { Card, CardBody, Skeleton, Spacer, cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { TicketNameSelect } from './ticket-name-select';
import { TicketTable } from './ticket-table';

const ByTicketFragment = graphql(/* GraphQL */ `
  fragment Dashboard_ByTicket on Community {
    communityStat {
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
    <WidgetTitle>{`${year} ${allowableWidgets.byTicket.info.label}`}</WidgetTitle>
  );
};

interface Props {
  className?: string;
}

const Chart: React.FC<Props> = ({ className }) => {
  const { community, ticketSelected, year, isLoading } = usePageContext();
  const entry = getFragment(ByTicketFragment, community);
  const ticketStat = React.useMemo(() => {
    return entry?.communityStat.ticketStat ?? [];
  }, [entry]);

  const ticketNameList = React.useMemo(() => {
    const result = new Set<string>();
    ticketStat.forEach(({ ticketName }) => result.add(ticketName));
    return [...result];
  }, [ticketStat]);

  const TicketSelect = React.useCallback(() => {
    if (!ticketNameList.length) {
      return null;
    }
    return <TicketNameSelect ticketNameList={ticketNameList} />;
  }, [ticketNameList]);

  const TicketDetails = React.useCallback(() => {
    if (!ticketSelected) {
      return null;
    }
    const ticketList = ticketStat.filter(
      ({ ticketName }) => ticketName === ticketSelected
    );
    return (
      <>
        <Spacer y={4} />
        <TicketTable ticketList={ticketList} />
      </>
    );
  }, [ticketStat, ticketSelected]);

  return (
    <Card className={cn(className)}>
      <CardBody>
        <Skeleton
          className="flex h-full flex-col rounded-lg"
          aria-label="skeleton"
          isLoaded={!isLoading}
        >
          <TicketSelect />
          <TicketDetails />
        </Skeleton>
      </CardBody>
    </Card>
  );
};

export const ByTicket = {
  Chart,
  Title,
};
