'use client';
import React from 'react';
import { actions, useDispatch, useSelector } from '~/custom-hooks/redux';
import * as GQL from '~/graphql/generated/graphql';
import { getCurrentYear } from '~/lib/date-util';
import { insertIf } from '~/lib/insert-if';
import { type CommunityEntry } from './community-query';

export interface SelectItemT {
  label: string;
  value: string;
}
export interface SelectSectionT {
  title: string;
  items: SelectItemT[];
  showDivider?: boolean;
}

export type CommunityState = Readonly<{
  /** Community entry */
  community: CommunityEntry;
  /** Community short ID */
  communityId: string;
  /** Community name */
  communityName: string;
  /** Access role items */
  roleItems: SelectItemT[];
  /** Minimum membership year recorded within membership */
  minYear: number;
  /** Maximum membership year recorded within membership */
  maxYear: number;
  /** Visible items (suitable for 'Add new --') */
  visibleEventItems: SelectItemT[];
  visibleTicketItems: SelectItemT[];
  visiblePaymentMethods: SelectItemT[];
  /** All items (including hidden, suitable for modify existing selection) */
  selectEventSections: SelectSectionT[];
  selectTicketSections: SelectSectionT[];
  selectPaymentMethodSections: SelectSectionT[];
  /** Ticket default configurations */
  ticketDefault: Map<string, GQL.SupportedTicketItem>;
  defaultSetting: GQL.DefaultSetting;
  /** Has Geoapify API key been specified */
  hasGeoapifyApiKey: boolean;
}>;

/**
 * Given a list of Supported items, group all visible items into `visibleItems`,
 * and create selection sections that contains all visible and hidden items
 *
 * @param list List of Supported items
 * @returns
 */
function createSelectionItems(
  list: (
    | GQL.SupportedEventItem
    | GQL.SupportedTicketItem
    | GQL.SupportedPaymentMethod
  )[]
) {
  const visibleItems: SelectItemT[] = [];
  const hiddenItems: SelectItemT[] = [];
  list.forEach((entry) => {
    if (entry.hidden) {
      hiddenItems.push({ label: entry.name, value: entry.name });
    } else {
      visibleItems.push({ label: entry.name, value: entry.name });
    }
  });
  const selectSections = [
    ...insertIf(visibleItems.length > 0, {
      title: '',
      items: visibleItems,
      showDivider: hiddenItems.length > 0,
    }),
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

export function useCommunityContext(community: CommunityEntry) {
  const dispatch = useDispatch();
  const { yearSelected } = useSelector((state) => state.ui);

  React.useEffect(() => {
    if (community && yearSelected == null) {
      // By default, show current year (unless it's not available)
      const defaultYear = Math.min(getCurrentYear(), community.maxYear);
      dispatch(actions.ui.setYearSelected(defaultYear));
    }
  }, [community, dispatch, yearSelected]);

  const stateValue = React.useMemo<CommunityState>(() => {
    const eventList = community.eventList ?? [];
    const ticketList = community.ticketList ?? [];
    const paymentMethodList = community.paymentMethodList ?? [];

    const roleItems: SelectItemT[] = [
      { label: 'Admin', value: GQL.Role.Admin },
      { label: 'Editor', value: GQL.Role.Editor },
      { label: 'Viewer', value: GQL.Role.Viewer },
    ];
    const eventSelect = createSelectionItems(eventList);
    const ticketSelect = createSelectionItems(ticketList);
    const paymentMethodSelect = createSelectionItems(paymentMethodList);

    const hasGeoapifyApiKey = !!community.geoapifySetting?.apiKey;

    return {
      community,
      communityId: community.id,
      communityName: community.name,
      roleItems,
      minYear: community.minYear ?? getCurrentYear(),
      maxYear: community.maxYear ?? getCurrentYear(),
      visibleEventItems: eventSelect.visibleItems,
      visibleTicketItems: ticketSelect.visibleItems,
      visiblePaymentMethods: paymentMethodSelect.visibleItems,
      selectEventSections: eventSelect.selectSections,
      selectTicketSections: ticketSelect.selectSections,
      selectPaymentMethodSections: paymentMethodSelect.selectSections,
      ticketDefault: new Map(ticketList.map((entry) => [entry.name, entry])),
      defaultSetting: community.defaultSetting ?? {
        __typename: 'DefaultSetting',
      },
      hasGeoapifyApiKey,
    };
  }, [community]);

  return stateValue;
}
