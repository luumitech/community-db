import { cn } from '@heroui/react';
import React from 'react';
import { getFragment, graphql } from '~/graphql/generated';
import { Card } from '~/view/base/card';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
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
  const { community, isLoading } = usePageContext();
  const entry = getFragment(ByTicketFragment, community);

  const ticketStat = entry?.communityStat.ticketStat ?? [];

  return (
    <Card className={cn(className, 'h-full')}>
      <Card.Body>
        <TicketTable
          className="h-full"
          ticketStat={ticketStat}
          isLoading={isLoading}
        />
      </Card.Body>
    </Card>
  );
};

export const ByTicket = {
  Chart,
  Title,
};
