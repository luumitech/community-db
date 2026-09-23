import { cn } from '@heroui/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { getFragment, graphql } from '~/graphql/generated';
import { lsFlags } from '~/lib/env';
import { Card } from '~/view/base/card';
import { WidgetTitle } from '~/view/base/grid-stack-with-card';
import { usePageContext } from '../../page-context';
import { allowableWidgets } from '../../widget-definition';
import { GroupBy } from './group-by';
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
  const { community, isLoading, ticketSelected } = usePageContext();
  const entry = getFragment(ByTicketFragment, community);
  const [groupBy = 'none', setGroupBy] = useLocalStorage(
    lsFlags.dashboardByTicketGroupBy,
    'none'
  );

  const ticketStat = React.useMemo(() => {
    return entry?.communityStat.ticketStat ?? [];
  }, [entry]);

  const ticketNameList = React.useMemo(() => {
    const result = new Set<string>();
    ticketStat.forEach(({ ticketName }) => result.add(ticketName));
    return [...result];
  }, [ticketStat]);

  return (
    <Card className={cn(className, 'h-full')}>
      <Card.Body className="flex flex-col gap-2">
        <TicketNameSelect ticketNameList={ticketNameList} />
        <GroupBy
          isDisabled={!ticketNameList.includes(ticketSelected)}
          defaultValue={groupBy}
          onValueChange={setGroupBy}
        />
        <TicketTable
          className="h-full"
          ticketStat={ticketStat}
          isLoading={isLoading}
          groupBy={groupBy}
        />
      </Card.Body>
    </Card>
  );
};

export const ByTicket = {
  Chart,
  Title,
};
