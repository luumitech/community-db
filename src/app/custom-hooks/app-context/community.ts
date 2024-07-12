import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import React from 'react';
import { useGraphqlErrorHandler } from '~/custom-hooks/graphql-error-handler';
import { graphql } from '~/graphql/generated';
import * as GQL from '~/graphql/generated/graphql';
import { insertIf } from '~/lib/insert-if';

const CommunityLayoutQuery = graphql(/* GraphQL */ `
  query communityLayout($communityId: String!) {
    communityFromId(id: $communityId) {
      id
      eventList {
        name
        hidden
      }
      paymentMethodList {
        name
        hidden
      }
      access {
        role
      }
    }
  }
`);

interface SelectItem {
  label: string;
  value: string;
}
interface SelectSection {
  title: string;
  items: SelectItem[];
  showDivider?: boolean;
}

export type CommunityState = Readonly<{
  /**
   * access role items
   */
  roleItems: SelectItem[];
  /**
   * visible event items (suitable for 'Add new event')
   */
  visibleEventItems: SelectItem[];
  /**
   * all event items (including hidden, suitable for event selection)
   */
  selectEventSections: SelectSection[];
  /**
   * all payment method items (including hidden)
   */
  selectPaymentMethodSections: SelectSection[];
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

/**
 * Given a list of SupportedSelectItem, group all visible
 * items into `visibleItems`, and create selection sections
 * that contains all visible and hidden items
 *
 * @param list list of SupportedSelectItem
 * @returns
 */
function createSelectionItems(list: GQL.SupportedSelectItem[]) {
  const visibleItems: SelectItem[] = [];
  const hiddenItems: SelectItem[] = [];
  list.forEach((entry) => {
    if (entry.hidden) {
      hiddenItems.push({ label: entry.name, value: entry.name });
    } else {
      visibleItems.push({ label: entry.name, value: entry.name });
    }
  });
  const selectSections = [
    {
      title: '',
      items: visibleItems,
      showDivider: hiddenItems.length > 0,
    },
    ...insertIf(hiddenItems.length > 0, {
      title: 'Deprecated Items',
      items: hiddenItems,
    }),
  ];
  return {
    visibleItems,
    selectSections,
  };
}

export function useCommunityContext() {
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

  const contextValue = React.useMemo<CommunityState>(() => {
    const eventList = community?.eventList ?? [];
    const paymentMethodList = community?.paymentMethodList ?? [];
    const role = community?.access.role ?? GQL.Role.Viewer;

    const roleItems: SelectItem[] = [
      { label: 'Admin', value: GQL.Role.Admin },
      { label: 'Editor', value: GQL.Role.Editor },
      { label: 'Viewer', value: GQL.Role.Viewer },
    ];
    const eventSelect = createSelectionItems(eventList);
    const paymentMethodSelect = createSelectionItems(paymentMethodList);

    return {
      roleItems,
      visibleEventItems: eventSelect.visibleItems,
      selectEventSections: eventSelect.selectSections,
      selectPaymentMethodSections: paymentMethodSelect.selectSections,
      role,
      canEdit: role === GQL.Role.Admin || role === GQL.Role.Editor,
    };
  }, [community]);

  return contextValue;
}
