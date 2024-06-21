import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';

const CommunityLayoutQuery = graphql(/* GraphQL */ `
  query communityLayout($communityId: String!) {
    communityFromId(id: $communityId) {
      id
      eventList {
        name
        hidden
      }
      access {
        role
      }
    }
  }
`);

interface EventSelectItem {
  label: string;
  value: string;
}
interface EventSelectSection {
  title: string;
  items: EventSelectItem[];
  showDivider?: boolean;
}

type State = Readonly<{
  eventList: GQL.SupportedEvent[];
  /**
   * selection items for 'Add new event'
   */
  addEventItems: EventSelectItem[];
  /**
   * selection items for 'Select event'
   */
  selectEventSections: EventSelectSection[];
  /**
   * Current user's role in this community
   */
  role: GQL.Role;
  /**
   * Base on current user's role, can user modify content within
   * this community?
   */
  canEdit: boolean;
}>;

interface ContextT extends State {}

// @ts-expect-error: intentionally leaving default value to be empty
const Context = React.createContext<ContextT>();

interface Props {
  children: React.ReactNode;
}

export function ContextProvider(props: Props) {
  const params = useParams<{ communityId?: string }>();
  const communityId = params.communityId;
  const result = useQuery(CommunityLayoutQuery, {
    variables: {
      communityId: params.communityId!,
    },
    skip: communityId == null,
  });
  useGraphqlErrorHandler(result);
  const community = result.data?.communityFromId;

  const value = React.useMemo<ContextT>(() => {
    const eventList = community?.eventList ?? [];
    const role = community?.access.role ?? GQL.Role.Viewer;

    const visibleEventItems: EventSelectItem[] = [];
    const hiddenEventItems: EventSelectItem[] = [];
    eventList.forEach((entry) => {
      if (entry.hidden) {
        hiddenEventItems.push({ label: entry.name, value: entry.name });
      } else {
        visibleEventItems.push({ label: entry.name, value: entry.name });
      }
    });
    const selectEventSections = [
      {
        title: '',
        items: visibleEventItems,
        showDivider: hiddenEventItems.length > 0,
      },
      { title: 'Deprecated Items', items: hiddenEventItems },
    ];

    return {
      eventList,
      addEventItems: visibleEventItems,
      selectEventSections,
      role,
      canEdit: role === GQL.Role.Admin || role === GQL.Role.Editor,
    };
  }, [community]);
  return <Context.Provider value={value} {...props} />;
}

export function useContext() {
  const context = React.useContext(Context);
  if (!context) {
    throw new Error(`useContext must be used within a ContextProvider`);
  }
  return context;
}
